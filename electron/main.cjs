const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");

let activeWorkspaceRoot;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    return;
  }

  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
};

app.whenReady().then(() => {
  ipcMain.handle("workspace:open", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Open Markdown Workspace",
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const rootPath = result.filePaths[0];
    activeWorkspaceRoot = path.resolve(rootPath);

    return {
      workspace: { rootPath: activeWorkspaceRoot },
      documents: await listMarkdownDocuments(activeWorkspaceRoot, activeWorkspaceRoot),
    };
  });

  ipcMain.handle("document:read", async (_event, documentPath) => {
    if (!activeWorkspaceRoot) {
      throw new Error("No workspace is open.");
    }

    const filePath = resolveWorkspaceDocumentPath(activeWorkspaceRoot, documentPath);
    const [content, fileStats] = await Promise.all([fs.readFile(filePath, "utf8"), fs.stat(filePath)]);

    return {
      path: toDocumentPath(activeWorkspaceRoot, filePath),
      title: getDocumentTitle(content, filePath),
      content,
      createdAt: fileStats.birthtime.toISOString(),
      updatedAt: fileStats.mtime.toISOString(),
    };
  });

  ipcMain.handle("document:write", async (_event, documentPath, content) => {
    if (!activeWorkspaceRoot) {
      throw new Error("No workspace is open.");
    }

    if (typeof content !== "string") {
      throw new Error("Document content must be text.");
    }

    const filePath = resolveWorkspaceDocumentPath(activeWorkspaceRoot, documentPath);
    await fs.writeFile(filePath, content, "utf8");

    const fileStats = await fs.stat(filePath);

    return {
      path: toDocumentPath(activeWorkspaceRoot, filePath),
      title: getDocumentTitle(content, filePath),
      content,
      createdAt: fileStats.birthtime.toISOString(),
      updatedAt: fileStats.mtime.toISOString(),
    };
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const listMarkdownDocuments = async (workspaceRoot, directoryPath) => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const documents = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      documents.push(...(await listMarkdownDocuments(workspaceRoot, entryPath)));
      continue;
    }

    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".md") {
      continue;
    }

    const fileStats = await fs.stat(entryPath);
    const documentPath = toDocumentPath(workspaceRoot, entryPath);

    documents.push({
      path: documentPath,
      title: path.basename(entryPath, path.extname(entryPath)),
      updatedAt: fileStats.mtime.toISOString(),
    });
  }

  return documents.sort((left, right) => left.path.localeCompare(right.path));
};

const resolveWorkspaceDocumentPath = (workspaceRoot, documentPath) => {
  if (path.isAbsolute(documentPath)) {
    throw new Error(`Document path must be relative to the workspace: ${documentPath}`);
  }

  if (path.extname(documentPath).toLowerCase() !== ".md") {
    throw new Error(`Only .md documents are supported: ${documentPath}`);
  }

  const resolvedPath = path.resolve(workspaceRoot, documentPath);
  const relativePath = path.relative(workspaceRoot, resolvedPath);

  if (relativePath === "" || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Document path must stay inside the workspace: ${documentPath}`);
  }

  return resolvedPath;
};

const toDocumentPath = (workspaceRoot, filePath) => path.relative(workspaceRoot, filePath).split(path.sep).join("/");

const getDocumentTitle = (content, filePath) => {
  const heading = content
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(/^#\s+(.+?)\s*$/);
      return match ? match[1].trim() : undefined;
    })
    .find(Boolean);

  return heading || path.basename(filePath, path.extname(filePath));
};
