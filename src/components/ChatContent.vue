<template>
  <el-main class="chat-main">
    <div class="chat-header" v-if="currentChat">
      <!-- 使用用户姓名首字母代替头像 -->
      <div class="avatar-placeholder">
        <span class="avatar-text">{{ getInitials(currentChat.name) }}</span>
      </div>
      <div class="chat-header-info">
        <span class="chat-title">{{ currentChat.name }}</span>
        <!-- 在线状态图标 -->
        <span 
          class="status-indicator" 
          :class="{ 'online': currentChat.status === '在线' || currentChat.status.includes('在线') }"
          :title="currentChat.status"
        ></span>
      </div>
    </div>
    <div class="chat-messages" ref="messageContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', message.sender === 'me' ? 'message-mine' : 'message-other']"
      >
        <!-- 左侧消息：头像在左，消息在右 -->
        <template v-if="message.sender !== 'me'">
          <div class="avatar-placeholder message-avatar">
            <span class="avatar-text">{{ getInitials(getSenderName(message.sender)) }}</span>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </template>
        
        <!-- 右侧消息：消息在左，头像在右（调换位置） -->
        <template v-else>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
          <div class="avatar-placeholder message-avatar">
            <span class="avatar-text">{{ getInitials("我") }}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="chat-input" v-if="currentChat">
      <!-- 工具栏 -->
      <Toolbar 
        @emoji-selected="handleEmojiSelected"
        @file-selected="handleFileSelected"
        @screenshot-taken="handleScreenshotTaken"
        @remote-assist-requested="handleRemoteAssistRequested"
        @resize="handleToolbarResize"
      />
      
      <!-- 输入区域 -->
      <InputArea
        ref="inputAreaRef"
        v-model="newMessage"
        @send="handleInputSend"
        @paste="handlePaste"
        @drop="handleDrop"
      />
    </div>
  </el-main>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Toolbar from './Toolbar.vue'
import InputArea from './InputArea.vue'

export default {
  name: 'ChatContent',
  components: {
    Toolbar,
    InputArea
  },
  props: {
    currentChat: {
      type: Object,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    chats: {
      type: Array,
      required: true
    },
    activeChat: {
      type: String,
      required: true
    }
  },
  emits: ['send-message'],
  setup(props, { emit }) {
    const newMessage = ref('')
    const messageContainer = ref(null)
    const inputAreaRef = ref(null)
    
    // 获取用户姓名首字母
    const getInitials = (name) => {
      if (!name) return '';
      return name.charAt(0).toUpperCase();
    }
    
    // 获取发送者姓名
    const getSenderName = (senderId) => {
      if (senderId === 'me') return '我';
      const chat = props.chats.find(c => c.id === props.activeChat);
      return chat ? chat.name : '未知用户';
    }
    
    // 发送消息
    const sendMessage = (message) => {
      if (message.trim()) {
        emit('send-message', message);
        newMessage.value = '';
      }
    }
    
    // 处理输入区域发送事件
    const handleInputSend = (message) => {
      sendMessage(message);
    }
    
    // 处理粘贴事件
    const handlePaste = (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          // 这里可以处理粘贴的图片
          console.log('粘贴的图片文件:', file);
          // 你可以在这里添加上传图片的逻辑
        }
      }
    }
    
    // 处理拖拽文件
    const handleDrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        // 这里可以处理拖拽的文件
        console.log('拖拽的文件:', files);
        // 你可以在这里添加上传文件的逻辑
      }
    }
    
    // 处理工具栏事件
    const handleEmojiSelected = (emoji) => {
      console.log('选择了表情:', emoji);
      // 这里可以处理选择的表情
      // 例如将表情添加到输入框中
      if (inputAreaRef.value) {
        const content = inputAreaRef.value.getTextContent() + emoji;
        inputAreaRef.value.setContent(content);
      }
    }
    
    const handleFileSelected = (file) => {
      console.log('选择了文件:', file);
      // 这里可以处理选择的文件
    }
    
    const handleScreenshotTaken = (screenshot) => {
      console.log('截取了屏幕截图:', screenshot);
      // 将截图插入到输入区域
      if (inputAreaRef.value) {
        // 创建图片元素
        const imgElement = `<img src="${screenshot.image}" class="screenshot-image" style="max-width: 200px; max-height: 200px;"/>`;
        
        // 获取当前内容并添加图片
        const currentContent = newMessage.value;
        newMessage.value = currentContent + imgElement;
      }
    }
    
    const handleRemoteAssistRequested = (request) => {
      console.log('发起了远程协助请求:', request);
      // 这里可以处理远程协助请求
    }
    
    // 处理工具栏大小调整
    const handleToolbarResize = (height) => {
      // 设置新的高度
      const chatInput = document.querySelector('.chat-input');
      if (chatInput) {
        chatInput.style.height = height + 'px';
      }
    }
    
    // 滚动到底部
    const scrollToBottom = () => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
      }
    }
    
    // 监听消息变化，自动滚动到底部
    onMounted(() => {
      scrollToBottom();
    })
    
    onUnmounted(() => {
      // 清理工作
    })
    
    return {
      newMessage,
      messageContainer,
      inputAreaRef,
      getInitials,
      getSenderName,
      handleInputSend,
      handlePaste,
      handleDrop,
      handleEmojiSelected,
      handleFileSelected,
      handleScreenshotTaken,
      handleRemoteAssistRequested,
      handleToolbarResize,
      scrollToBottom
    }
  }
}
</script>

<style scoped>
.chat-main {
  display: flex;
  flex-direction: column;
  padding: 0;
  background-color: #f5f5f5;
  min-height: 600px;
  min-width: 800px;
}

.chat-header {
  background-color: #ffffff;
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.chat-header-info {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.chat-title {
  font-weight: bold;
  margin-right: 8px;
}

/* 在线状态指示器 */
.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc; /* 离线状态为灰色 */
}

.status-indicator.online {
  background-color: #07c160; /* 在线状态为绿色 */
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  margin-bottom: 15px;
  width: 100%;
}

.message-other {
  align-self: flex-start;
  margin-right: auto;
}

.message-mine {
  align-self: flex-end;
  margin-left: auto;
  flex-direction: row-reverse;
  width: 100%;
  justify-content: flex-end;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  max-width: 75%;
}

.message-text {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  width: fit-content;
  max-width: 100%;
}

.message-mine .message-text {
  background-color: #07c160;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  text-align: right;
  align-self: flex-end;
  width: 100%;
}

.chat-input {
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  min-height: 120px;
  max-height: 800px;
  resize: vertical;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  cursor: ns-resize;
  position: relative;
}

.toolbar-btn {
  padding: 5px;
  margin-right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.toolbar-btn:hover {
  color: #07c160;
}

.drag-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: ns-resize;
  background: repeating-linear-gradient(
    to bottom,
    #ccc,
    #ccc 2px,
    transparent 2px,
    transparent 4px
  );
}

.input-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
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
}

.message-input:focus {
  outline: none;
  border-color: #07c160;
}

/* 头像占位符样式 */
.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #07c160;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-placeholder.message-avatar {
  width: 30px;
  height: 30px;
}

.avatar-text {
  color: white;
  font-weight: bold;
  font-size: 16px;
}
</style>