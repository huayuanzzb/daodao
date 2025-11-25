<template>
  <div class="input-area">
    <div
      ref="messageInput"
      contenteditable="true"
      class="message-input"
      placeholder="输入消息... (Enter发送，Ctrl+Enter换行)"
      @keydown="handleKeydown"
      @paste="handlePaste"
      @drop="handleDrop"
      @dragover.prevent
    ></div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'

export default {
  name: 'InputArea',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'send'],
  setup(props, { emit }) {
    const messageInput = ref(null)
    
    // 监听输入框内容变化
    const handleInput = () => {
      if (messageInput.value) {
        const content = messageInput.value.innerHTML
        emit('update:modelValue', content)
      }
    }
    
    // 监听外部传入的值变化
    watch(() => props.modelValue, (newValue) => {
      if (messageInput.value && messageInput.value.innerHTML !== newValue) {
        messageInput.value.innerHTML = newValue
      }
    })
    
    // 处理键盘事件
    const handleKeydown = (event) => {
      // Ctrl + Enter 换行
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault()
        insertTextAtCursor('\n')
        return
      }
      
      // Enter 发送消息（排除 Shift + Enter）
      if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
        event.preventDefault()
        const content = messageInput.value.innerHTML
        emit('send', content)
        // 清空输入框
        messageInput.value.innerHTML = ''
      }
    }
    
    // 在光标位置插入文本
    const insertTextAtCursor = (text) => {
      const el = messageInput.value
      const selection = window.getSelection()
      
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        
        const textNode = document.createTextNode(text)
        range.insertNode(textNode)
        
        // 移动光标到插入文本之后
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        el.innerHTML += text
      }
    }
    
    // 处理粘贴事件
    const handlePaste = (event) => {
      event.preventDefault()
      
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      const pasteData = []
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        
        if (item.type.indexOf('image') !== -1) {
          // 处理粘贴的图片
          const file = item.getAsFile()
          const reader = new FileReader()
          
          reader.onload = (e) => {
            // 创建图片元素
            const img = document.createElement('img')
            img.src = e.target.result
            img.style.maxWidth = '100px'
            img.style.maxHeight = '100px'
            img.className = 'pasted-image'
            
            // 插入到光标位置
            const selection = window.getSelection()
            if (selection.rangeCount) {
              const range = selection.getRangeAt(0)
              range.deleteContents()
              range.insertNode(img)
              
              // 移动光标到图片之后
              range.setStartAfter(img)
              range.setEndAfter(img)
              selection.removeAllRanges()
              selection.addRange(range)
            }
          }
          
          reader.readAsDataURL(file)
        } else if (item.type === 'text/plain') {
          // 处理纯文本
          item.getAsString((text) => {
            insertTextAtCursor(text)
          })
        }
      }
    }
    
    // 处理拖拽文件
    const handleDrop = (event) => {
      event.preventDefault()
      const files = event.dataTransfer.files
      
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          
          if (file.type.startsWith('image/')) {
            // 处理拖拽的图片
            const reader = new FileReader()
            
            reader.onload = (e) => {
              // 创建图片元素
              const img = document.createElement('img')
              img.src = e.target.result
              img.style.maxWidth = '100px'
              img.style.maxHeight = '100px'
              img.className = 'pasted-image'
              
              // 插入到光标位置或末尾
              const el = messageInput.value
              const selection = window.getSelection()
              
              if (selection.rangeCount) {
                const range = selection.getRangeAt(0)
                range.deleteContents()
                range.insertNode(img)
                
                // 移动光标到图片之后
                range.setStartAfter(img)
                range.setEndAfter(img)
                selection.removeAllRanges()
                selection.addRange(range)
              } else {
                el.appendChild(img)
              }
            }
            
            reader.readAsDataURL(file)
          }
        }
      }
    }
    
    // 聚焦到输入框
    const focus = () => {
      if (messageInput.value) {
        messageInput.value.focus()
      }
    }
    
    // 获取输入框的纯文本内容
    const getTextContent = () => {
      if (messageInput.value) {
        return messageInput.value.innerText || ''
      }
      return ''
    }
    
    // 获取输入框的HTML内容
    const getHtmlContent = () => {
      if (messageInput.value) {
        return messageInput.value.innerHTML || ''
      }
      return ''
    }
    
    // 设置输入框内容
    const setContent = (content) => {
      if (messageInput.value) {
        messageInput.value.innerHTML = content
      }
    }
    
    // 在组件挂载后添加事件监听器
    watch(messageInput, () => {
      if (messageInput.value) {
        messageInput.value.addEventListener('input', handleInput)
      }
    })
    
    // 暴露方法给父组件
    return {
      messageInput,
      handleKeydown,
      handlePaste,
      handleDrop,
      focus,
      getTextContent,
      getHtmlContent,
      setContent
    }
  }
}
</script>

<style scoped>
.input-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0px;
  min-height: 80px; /* 5行文本的高度 */
  max-height: 500px; /* 35行文本的高度 */
}

.message-input {
  flex: 1;
  resize: none;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  overflow-y: auto;
  min-height: 80px;
}

.message-input:focus {
  border-color: #07c160;
}

.message-input:empty:before {
  content: attr(placeholder);
  color: #ccc;
  pointer-events: none;
}

.pasted-image {
  max-width: 100px;
  max-height: 100px;
  vertical-align: middle;
  margin: 2px;
}
</style>