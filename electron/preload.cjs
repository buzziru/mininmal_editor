const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("markdownEditor", {
  platform: process.platform,
  openWorkspace: () => ipcRenderer.invoke("workspace:open"),
  readDocument: (documentPath) => ipcRenderer.invoke("document:read", documentPath),
});
