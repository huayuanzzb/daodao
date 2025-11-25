#!/bin/bash

# 遇到任何错误时退出
set -e

# 获取项目根目录
PROJECT_ROOT=$(pwd)

# 运行 Go 测试
echo "正在运行 Go 测试..."
cd "$PROJECT_ROOT"
go test -v ./...

echo "所有测试通过!"