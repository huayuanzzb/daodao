const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('Electron Application Tests', () => {
  let electronProcess;
  
  beforeAll(() => {
    // Check if the executable exists
    const executablePath = path.join(__dirname, '..', 'dist', 'electron-go-app');
    if (!fs.existsSync(executablePath)) {
      console.log('可执行文件不存在，跳过测试');
      return;
    }
  }, 30000);
  
  test('should have required UI files', () => {
    // Check if required UI files exist
    const requiredFiles = [
      'index.html',
      'main.js',
      'preload.js',
      'renderer.js'
    ];
    
    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
  
  test('should have package.json with correct configuration', () => {
    // Check if package.json exists and has correct configuration
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    expect(packageJson.name).toBe('electron-go-app');
    expect(packageJson.main).toBe('ui/main.js');
    expect(packageJson.scripts).toHaveProperty('start');
  });
});