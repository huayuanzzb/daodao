package main

import (
	"bufio"
	"electron-go-app/internal/handlers"
	"fmt"
	"os"
	"strings"
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