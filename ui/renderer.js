// 此文件由 index.html 文件加载并在渲染进程中执行

// 等待 DOM 完全加载
document.addEventListener('DOMContentLoaded', async () => {
  const messageElement = document.getElementById('hello-message');
  
  // 显示初始加载状态
  if (messageElement) {
    messageElement.textContent = '加载中...';
  }
  
  try {
    // 重试查询后端状态直至成功或超时
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 30; // 最多尝试30次，总共等待30秒
    let lastError = null;
    
    while (!isReady && attempts < maxAttempts) {
      const status = await window.electronAPI.isGoReady();
      if (status.ready) {
        isReady = true;
        break;
      } else if (status.error) {
        lastError = status.error;
      }
      
      // 等待一段时间再重试
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
      
      // 更新加载状态显示
      if (messageElement) {
        messageElement.textContent = `加载中... (${attempts}/${maxAttempts})`;
      }
    }
    
    if (!isReady) {
      if (messageElement) {
        if (lastError) {
          messageElement.textContent = `后端启动失败: ${lastError}`;
        } else {
          messageElement.textContent = '后端启动超时，请稍后重试';
        }
      }
      return;
    }
    
    // 构造请求对象
    const request = {
      id: 'get-hello-' + Date.now(),
      command: 'get-hello-message',
      params: {}
    };
    
    // 调用主进程获取 hello 消息
    const response = await window.electronAPI.sendRequest(request);
    
    // 使用消息更新 DOM
    if (messageElement && response.status === 'success' && response.data && response.data.message) {
      messageElement.textContent = response.data.message;
    } else if (messageElement) {
      messageElement.textContent = '加载消息时出错';
    }
  } catch (error) {
    console.error('获取 hello 消息时出错:', error);
    if (messageElement) {
      messageElement.textContent = `加载消息时出错: ${error.message}`;
    }
  }
});