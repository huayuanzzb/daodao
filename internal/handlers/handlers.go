package handlers

import (
	"encoding/json"
)

// Request 代表请求结构
type Request struct {
	ID      string                 `json:"id"`
	Command string                 `json:"command"`
	Params  map[string]interface{} `json:"params"`
}

// Response 代表响应结构
type Response struct {
	ID     string      `json:"id"`
	Status string      `json:"status"` // "success" 或 "error"
	Data   interface{} `json:"data,omitempty"`
	Error  string      `json:"error,omitempty"`
}

// HandleRequest 处理请求并返回响应
func HandleRequest(request Request) Response {
	response := Response{
		ID: request.ID,
	}

	switch request.Command {
	case "get-hello-message":
		response.Status = "success"
		response.Data = map[string]string{
			"message": "Hello World",
		}
	case "echo":
		// 示例：回显功能
		if text, ok := request.Params["text"].(string); ok {
			response.Status = "success"
			response.Data = map[string]string{
				"echo": text,
			}
		} else {
			response.Status = "error"
			response.Error = "参数 'text' 缺失或类型错误"
		}
	default:
		response.Status = "error"
		response.Error = "未知命令: " + request.Command
	}

	return response
}

// ProcessCommand 处理命令字符串并返回JSON响应
func ProcessCommand(input string) (string, error) {
	var request Request
	if err := json.Unmarshal([]byte(input), &request); err != nil {
		// 如果不是JSON格式，返回错误
		return "", err
	}

	response := HandleRequest(request)
	responseBytes, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(responseBytes), nil
}