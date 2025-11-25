package test

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestEndToEndCommunication(t *testing.T) {
	// 获取可执行文件路径
	wd, err := os.Getwd()
	assert.NoError(t, err)
	
	// 构建可执行文件路径
	executablePath := filepath.Join(wd, "..", "dist", "electron-go-app")
	
	// 检查可执行文件是否存在
	if _, err := os.Stat(executablePath); os.IsNotExist(err) {
		// 尝试其他可能的路径
		executablePath = filepath.Join(wd, "..", "electron-go-app")
		if _, err := os.Stat(executablePath); os.IsNotExist(err) {
			t.Skip("可执行文件不存在，跳过测试")
		}
	}
	
	// 启动 Go 进程
	cmd := exec.Command(executablePath)
	stdin, err := cmd.StdinPipe()
	assert.NoError(t, err)
	
	stdout, err := cmd.StdoutPipe()
	assert.NoError(t, err)
	
	// 启动进程
	err = cmd.Start()
	assert.NoError(t, err)
	
	// 确保进程已经启动
	time.Sleep(500 * time.Millisecond)
	
	// 创建一个带缓冲的 reader
	reader := bufio.NewReader(stdout)
	
	// 使用通道来接收响应
	responseCh := make(chan string, 1)
	errorCh := make(chan error, 1)
	
	go func() {
		// 读取响应，设置超时
		timer := time.NewTimer(5 * time.Second)
		defer timer.Stop()
		
		select {
		case <-timer.C:
			errorCh <- fmt.Errorf("读取响应超时")
		default:
			// 读取一行响应
			response, err := reader.ReadString('\n')
			if err != nil {
				errorCh <- err
				return
			}
			responseCh <- response
		}
	}()
	
	// 向进程发送命令
	_, err = stdin.Write([]byte(`{"id":"1","command":"get-hello-message"}` + "\n"))
	assert.NoError(t, err)
	
	// 等待响应或超时
	select {
	case response := <-responseCh:
		assert.Contains(t, response, "Hello World")
	case err := <-errorCh:
		t.Fatalf("读取响应时出错: %v", err)
	case <-time.After(10 * time.Second):
		t.Fatal("测试超时")
	}
	
	// 发送退出命令
	_, err = stdin.Write([]byte("quit\n"))
	assert.NoError(t, err)
	
	// 等待进程退出
	done := make(chan error, 1)
	go func() {
		done <- cmd.Wait()
	}()
	
	select {
	case <-done:
		// 进程已退出
	case <-time.After(5 * time.Second):
		// 强制杀死进程
		cmd.Process.Kill()
		t.Fatal("进程未在规定时间内退出")
	}
}