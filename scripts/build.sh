#!/bin/bash

# 遇到任何错误时退出
set -e

# 获取项目根目录
PROJECT_ROOT=$(pwd)

# 如果 dist 目录不存在则创建
mkdir -p "$PROJECT_ROOT/dist"

# 构建 Go 后端
echo "正在构建 Go 后端..."
cd "$PROJECT_ROOT"

# 确保 cmd/electron-go-app 目录存在
if [ ! -d "./cmd/electron-go-app" ]; then
    echo "创建 cmd/electron-go-app 目录"
    mkdir -p "./cmd/electron-go-app"
fi

# 如果 main.go 不存在，则创建一个简单的示例
if [ ! -f "./cmd/electron-go-app/main.go" ]; then
    echo "创建示例 main.go 文件"
    cat > "./cmd/electron-go-app/main.go" << 'EOF'
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	
	"electron-go-app/internal/handlers"
)

func main() {
	// 创建一个 Scanner 来读取标准输入
	scanner := bufio.NewScanner(os.Stdin)
	
	// 持续监听标准输入
	for scanner.Scan() {
		input := strings.TrimSpace(scanner.Text())
		
		// 处理退出命令
		if input == "quit" {
			break
		}
		
		// 处理命令并获取响应
		response, err := handlers.ProcessCommand(input)
		if err != nil {
			fmt.Fprintf(os.Stderr, "处理命令时出错: %v\n", err)
			continue
		}
		
		// 输出响应
		fmt.Println(response)
	}
	
	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "读取输入时出错: %v\n", err)
		os.Exit(1)
	}
}
EOF
fi

# 构建可执行文件
go build -o "$PROJECT_ROOT/dist/electron-go-app" ./cmd/electron-go-app

# 复制 UI 文件到 dist
echo "正在复制 UI 文件..."
mkdir -p "$PROJECT_ROOT/dist/ui"
cp "$PROJECT_ROOT/ui/main.js" "$PROJECT_ROOT/dist/ui/"
cp "$PROJECT_ROOT/ui/preload.js" "$PROJECT_ROOT/dist/ui/"
cp "$PROJECT_ROOT/ui/renderer.js" "$PROJECT_ROOT/dist/ui/"
cp "$PROJECT_ROOT/ui/index.html" "$PROJECT_ROOT/dist/ui/"
cp "$PROJECT_ROOT/ui/e2e.test.js" "$PROJECT_ROOT/dist/ui/"
cp "$PROJECT_ROOT/ui/electron.test.js" "$PROJECT_ROOT/dist/ui/"
cp "$PROJECT_ROOT/ui/index-electron.html" "$PROJECT_ROOT/dist/ui/"

# 在项目根目录中构建 Vue 应用
echo "正在构建 Vue 应用..."
cd "$PROJECT_ROOT"
# 安装依赖
npm install
# 构建 Vue 应用到 dist/ui 目录
npx vite build

# 为 Electron 创建 package.json
echo "正在创建 package.json..."
cat > "$PROJECT_ROOT/dist/package.json" << EOF
{
  "name": "electron-go-app",
  "version": "1.0.0",
  "description": "一个带有 Go 后端的 Electron 应用",
  "main": "ui/main.js",
  "scripts": {
    "start": "electron ."
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "electron": "^21.0.0"
  },
  "dependencies": {
    "node-fetch": "^3.3.0",
    "vue": "^3.2.0",
    "element-plus": "^2.0.0"
  }
}
EOF

echo "构建成功完成!"