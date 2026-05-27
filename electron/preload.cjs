const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("markdownEditor", {
  platform: process.platform,
  openWorkspace: () => ipcRenderer.invoke("workspace:open"),
  openDocument: () => ipcRenderer.invoke("document:open"),
  readDocument: (documentPath) => ipcRenderer.invoke("document:read", documentPath),
  writeDocument: (documentPath, content) => ipcRenderer.invoke("document:write", documentPath, content),
  createDocument: (documentPath) => ipcRenderer.invoke("document:create", documentPath),
  renameDocument: (currentPath, nextPath) => ipcRenderer.invoke("document:rename", currentPath, nextPath),
  deleteDocument: (documentPath) => ipcRenderer.invoke("document:delete", documentPath),
  onOpenWorkspaceRequested: (callback) => {
    ipcRenderer.on("menu:open-workspace", callback);

    return () => {
      ipcRenderer.removeListener("menu:open-workspace", callback);
    };
  },
  onOpenDocumentRequested: (callback) => {
    ipcRenderer.on("menu:open-document", callback);

    return () => {
      ipcRenderer.removeListener("menu:open-document", callback);
    };
  },
  onSaveDocumentRequested: (callback) => {
    ipcRenderer.on("menu:save-document", callback);

    return () => {
      ipcRenderer.removeListener("menu:save-document", callback);
    };
  },
});
