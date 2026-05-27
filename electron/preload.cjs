const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("markdownEditor", {
  platform: process.platform,
  openWorkspace: () => ipcRenderer.invoke("workspace:open"),
  readDocument: (documentPath) => ipcRenderer.invoke("document:read", documentPath),
  writeDocument: (documentPath, content) => ipcRenderer.invoke("document:write", documentPath, content),
  createDocument: (documentPath) => ipcRenderer.invoke("document:create", documentPath),
  renameDocument: (currentPath, nextPath) => ipcRenderer.invoke("document:rename", currentPath, nextPath),
  deleteDocument: (documentPath) => ipcRenderer.invoke("document:delete", documentPath),
});
