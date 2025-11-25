package handlers

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHandleRequest_GetHelloMessage(t *testing.T) {
	request := Request{
		ID:      "test-1",
		Command: "get-hello-message",
		Params:  map[string]interface{}{},
	}

	response := HandleRequest(request)
	
	assert.Equal(t, "test-1", response.ID)
	assert.Equal(t, "success", response.Status)
	assert.Empty(t, response.Error)
	
	// 类型断言需要匹配实际的类型
	data, ok := response.Data.(map[string]string)
	assert.True(t, ok, "Data should be a map[string]string")
	assert.Equal(t, "Hello World", data["message"])
}

func TestHandleRequest_Echo(t *testing.T) {
	request := Request{
		ID:      "test-2",
		Command: "echo",
		Params: map[string]interface{}{
			"text": "Hello, World!",
		},
	}

	response := HandleRequest(request)
	
	assert.Equal(t, "test-2", response.ID)
	assert.Equal(t, "success", response.Status)
	assert.Empty(t, response.Error)
	
	// 类型断言需要匹配实际的类型
	data, ok := response.Data.(map[string]string)
	assert.True(t, ok, "Data should be a map[string]string")
	assert.Equal(t, "Hello, World!", data["echo"])
}

func TestHandleRequest_UnknownCommand(t *testing.T) {
	request := Request{
		ID:      "test-3",
		Command: "unknown-command",
		Params:  map[string]interface{}{},
	}

	response := HandleRequest(request)
	
	assert.Equal(t, "test-3", response.ID)
	assert.Equal(t, "error", response.Status)
	assert.Equal(t, "未知命令: unknown-command", response.Error)
	assert.Nil(t, response.Data)
}

func TestProcessCommand_JSON(t *testing.T) {
	// 测试 JSON 格式的命令
	jsonRequest := `{"id": "test-4", "command": "get-hello-message", "params": {}}`
	
	responseStr, err := ProcessCommand(jsonRequest)
	assert.NoError(t, err)
	
	var response Response
	err = json.Unmarshal([]byte(responseStr), &response)
	assert.NoError(t, err)
	
	assert.Equal(t, "test-4", response.ID)
	assert.Equal(t, "success", response.Status)
	assert.Empty(t, response.Error)
	
	// 对于反序列化的数据，类型是 map[string]interface{}
	data, ok := response.Data.(map[string]interface{})
	assert.True(t, ok, "Data should be a map[string]interface{}")
	assert.Equal(t, "Hello World", data["message"])
}

func TestProcessCommand_InvalidFormat(t *testing.T) {
	// 测试无效格式的命令
	_, err := ProcessCommand("get-hello-message")
	assert.Error(t, err)
}