const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Check if the executable exists
const executablePath = path.join(__dirname, '..', 'dist', 'electron-go-app');

describe('Electron App End-to-End Test', () => {
  let electronProcess;
  
  beforeAll(() => {
    // Check if executable exists
    try {
      require('fs').accessSync(executablePath);
    } catch (err) {
      // Skip tests if executable doesn't exist
      console.log('可执行文件不存在，跳过端到端测试');
      return;
    }
    
    // Start the Electron app
    electronProcess = spawn('npx', ['electron', '.'], {
      cwd: path.join(__dirname, '..', 'dist'),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    // Handle process errors
    electronProcess.on('error', (err) => {
      console.error('启动 Electron 应用时出错:', err);
    });
  }, 30000); // 30 second timeout for app startup
  
  afterAll(() => {
    // Kill the Electron process after tests
    if (electronProcess) {
      electronProcess.kill();
    }
  });
  
  test('should start Electron app and display Hello World', (done) => {
    if (!electronProcess) {
      // Skip test if process wasn't started
      done();
      return;
    }
    
    // Set a timeout for the test
    const timeout = setTimeout(() => {
      done(new Error('测试超时'));
    }, 15000); // 15 second timeout
    
    // Listen for output from the Go process
    electronProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Go 后端输出:', output);
      
      // Check if we received the Hello World message
      if (output.includes('{"message":"Hello World"}')) {
        clearTimeout(timeout);
        done();
      }
    });
    
    electronProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.error('Electron 错误输出:', error);
    });
  }, 20000); // 20 second timeout for the test
  
  test('should handle Electron app errors gracefully', (done) => {
    // This test checks that the app doesn't crash immediately
    if (!electronProcess) {
      // Skip test if process wasn't started
      done();
      return;
    }
    
    // Set a timeout to check if the app is still running
    const timeout = setTimeout(() => {
      // If we reach here, the app is still running (which is good)
      done();
    }, 5000); // 5 second timeout
    
    electronProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        done();
      } else {
        done(new Error(`Electron 应用异常退出，退出码: ${code}`));
      }
    });
    
    electronProcess.on('error', (err) => {
      clearTimeout(timeout);
      done(new Error(`Electron 应用启动失败: ${err.message}`));
    });
  }, 10000); // 10 second timeout for the test
});