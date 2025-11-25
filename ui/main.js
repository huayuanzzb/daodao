const { app, BrowserWindow, ipcMain, screen, desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');

// 保持对窗口对象的全局引用，如果不这样做，当JavaScript对象被垃圾回收时，窗口会自动关闭
let mainWindow;
let screenshotWindow = null;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // 移除不安全的配置
      // webSecurity: false
    },
  });

  // 在开发环境中加载 Vite 开发服务器，在生产环境中加载打包后的文件
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://127.0.0.1:3000');
  } else {
    // 使用 file:// 协议加载本地文件
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  // 打开开发者工具
  mainWindow.webContents.openDevTools();
}

// 当 Electron 完成初始化并准备创建浏览器窗口时，会调用这个方法
// 某些 API 只能在此事件发生后使用
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // 在 macOS 上，当点击 dock 图标且没有其他窗口打开时，通常会重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口都关闭时退出，除了 macOS。在 macOS 上，通常应用程序和它们的菜单栏会保持活跃
// 直到用户明确使用 Cmd + Q 退出
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 获取屏幕截图
ipcMain.handle('get-screenshots', async () => {
  try {
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    const screenshots = [];
    
    for (const source of sources) {
      screenshots.push({
        id: source.id,
        name: source.name,
        thumbnail: source.thumbnail.toDataURL()
      });
    }
    
    return {
      success: true,
      screenshots
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// 区域截图功能
ipcMain.handle('take-region-screenshot', async (event, bounds) => {
  try {
    // 使用 desktopCapturer 获取整个屏幕截图，设置足够大的尺寸
    const sources = await desktopCapturer.getSources({ 
      types: ['screen'],
      thumbnailSize: { 
        width: Math.max(bounds.x + bounds.width, 1920), 
        height: Math.max(bounds.y + bounds.height, 1080)
      }
    });
    
    if (sources.length === 0) {
      throw new Error('No screens found');
    }
    
    // 获取主屏幕截图
    const source = sources[0];
    const fullImage = source.thumbnail;
    
    // 返回整个屏幕截图和边界信息，让渲染进程处理裁剪
    return {
      success: true,
      image: fullImage.toDataURL(),
      bounds: bounds,
      screenSize: {
        width: fullImage.getSize().width,
        height: fullImage.getSize().height
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('截图失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
});