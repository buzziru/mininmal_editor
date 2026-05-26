const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");

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

    return {
      workspace: { rootPath },
      documents: await listMarkdownDocuments(rootPath, rootPath),
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
    const documentPath = path.relative(workspaceRoot, entryPath).split(path.sep).join("/");

    documents.push({
      path: documentPath,
      title: path.basename(entryPath, path.extname(entryPath)),
      updatedAt: fileStats.mtime.toISOString(),
    });
  }

  return documents.sort((left, right) => left.path.localeCompare(right.path));
};
