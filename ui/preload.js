const { contextBridge, ipcRenderer } = require('electron');

// 将 ipcRenderer 方法安全地暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 区域截图功能
  getScreenshots: () => ipcRenderer.invoke('get-screenshots'),
  takeRegionScreenshot: (bounds) => ipcRenderer.invoke('take-region-screenshot', bounds),
});