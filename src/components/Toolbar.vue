<template>
  <div class="toolbar" ref="toolbar">
    <EmojiTool @emoji-selected="handleEmojiSelected" />
    <FileTool @file-selected="handleFileSelected" />
    <ScreenshotTool @screenshot-taken="handleScreenshotTaken" />
    <RemoteAssistTool @remote-assist-requested="handleRemoteAssistRequested" />
    <!-- 拖动手柄 -->
    <div class="drag-handle" @mousedown="startDrag"></div>
  </div>
</template>

<script>
import { ref } from 'vue'
import EmojiTool from './tools/EmojiTool.vue'
import FileTool from './tools/FileTool.vue'
import ScreenshotTool from './tools/ScreenshotTool.vue'
import RemoteAssistTool from './tools/RemoteAssistTool.vue'

export default {
  name: 'Toolbar',
  components: {
    EmojiTool,
    FileTool,
    ScreenshotTool,
    RemoteAssistTool
  },
  emits: ['emoji-selected', 'file-selected', 'screenshot-taken', 'remote-assist-requested', 'resize'],
  setup(props, { emit }) {
    const toolbar = ref(null)
    
    // 拖动相关变量
    let isDragging = false
    let startY = 0
    let startHeight = 0
    
    // 开始拖动
    const startDrag = (event) => {
      isDragging = true
      startY = event.clientY
      startHeight = toolbar.value.parentElement.offsetHeight
      
      // 添加事件监听器
      document.addEventListener('mousemove', doDrag)
      document.addEventListener('mouseup', stopDrag)
    }
    
    // 执行拖动
    const doDrag = (event) => {
      if (!isDragging) return
      
      const deltaY = event.clientY - startY
      const newHeight = startHeight + deltaY
      
      // 限制高度范围（最小120px，最大800px）
      const clampedHeight = Math.min(Math.max(newHeight, 120), 800)
      
      // 发出resize事件
      emit('resize', clampedHeight)
    }
    
    // 停止拖动
    const stopDrag = () => {
      isDragging = false
      
      // 移除事件监听器
      document.removeEventListener('mousemove', doDrag)
      document.removeEventListener('mouseup', stopDrag)
    }
    
    // 处理各个工具的事件
    const handleEmojiSelected = (emoji) => {
      emit('emoji-selected', emoji)
    }
    
    const handleFileSelected = (file) => {
      emit('file-selected', file)
    }
    
    const handleScreenshotTaken = (screenshot) => {
      emit('screenshot-taken', screenshot)
    }
    
    const handleRemoteAssistRequested = (request) => {
      emit('remote-assist-requested', request)
    }
    
    return {
      toolbar,
      startDrag,
      handleEmojiSelected,
      handleFileSelected,
      handleScreenshotTaken,
      handleRemoteAssistRequested
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  cursor: ns-resize;
  position: relative;
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
</style>