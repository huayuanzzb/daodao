# Electron + Go Hello World 应用

这是一个简单的 Electron 应用程序，使用 Go 后端在 UI 中显示 "Hello World"。

## 项目结构

```
.
├── README.md
├── go.mod
├── go.sum
├── package.json
├── pkg/
│   └── api/
│       └── server.go
├── cmd/
│   └── electron-go-app/
│       └── main.go
├── internal/
│   └── handlers/
│       ├── handlers.go
│       └── handlers_test.go
├── ui/
│   ├── index.html
│   ├── main.js
│   ├── preload.js
│   └── renderer.js
├── test/
│   ├── integration_test.go
│   └── e2e_test.go
├── scripts/
│   ├── build.sh
│   └── test.sh
└── .github/
    └── workflows/
        └── test.yml
```

## 环境要求

- Go 1.16+
- Node.js 14+
- npm 6+

## 运行步骤

1. 安装依赖:
   ```
   # 进入项目根目录
   cd /Users/bing/daodao
   
   # 安装 Go 依赖
   GOPROXY=https://goproxy.cn,direct go mod tidy
   
   # 安装 Node.js 依赖
   npm install
   ```

2. 构建应用程序:
   ```
   ./scripts/build.sh
   ```

3. 安装 Electron 依赖:
   ```
   # 进入构建目录
   cd dist
   
   # 安装 Electron 依赖
   npm install
   ```

4. 启动应用程序:
   ```
   npm start
   ```

## 测试

运行单元测试和集成测试:
```
npm test
```

手动运行测试脚本:
```
./scripts/test.sh
```

## GitHub Actions

此仓库配置了 GitHub Actions 进行持续集成。每次推送到主分支和每个拉取请求时都会自动运行测试。

## 打包应用程序

要将应用程序打包为 Mac 上可运行的程序包，请执行以下步骤:

1. 安装 electron-builder:
   ```
   npm install -g electron-builder
   ```

2. 在项目根目录运行打包命令:
   ```
   # 进入项目根目录
   cd /Users/bing/daodao
   
   # 打包 Mac 应用
   electron-builder --mac
   ```

3. 打包完成后，可在 dist 目录下找到生成的 .dmg 或 .zip 文件。