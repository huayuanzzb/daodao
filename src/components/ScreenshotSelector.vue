<template>
  <div class="screenshot-selector" v-if="isVisible">
    <div class="overlay" @mousedown="startSelection">
      <div 
        class="selection-box" 
        v-if="isSelecting || hasSelection"
        :style="selectionBoxStyle"
        @mousedown.stop="startMoveSelection"
      >
        <!-- 顶部中间调整点 -->
        <div class="resize-handle top" @mousedown.stop="startResize('top')"></div>
        <!-- 底部中间调整点 -->
        <div class="resize-handle bottom" @mousedown.stop="startResize('bottom')"></div>
        <!-- 左侧中间调整点 -->
        <div class="resize-handle left" @mousedown.stop="startResize('left')"></div>
        <!-- 右侧中间调整点 -->
        <div class="resize-handle right" @mousedown.stop="startResize('right')"></div>
        <!-- 左上角调整点 -->
        <div class="resize-handle top-left" @mousedown.stop="startResize('top-left')"></div>
        <!-- 右上角调整点 -->
        <div class="resize-handle top-right" @mousedown.stop="startResize('top-right')"></div>
        <!-- 左下角调整点 -->
        <div class="resize-handle bottom-left" @mousedown.stop="startResize('bottom-left')"></div>
        <!-- 右下角调整点 -->
        <div class="resize-handle bottom-right" @mousedown.stop="startResize('bottom-right')"></div>
      </div>
    </div>
    
    <!-- 底部工具栏 -->
    <div class="bottom-toolbar" v-if="hasSelection">
      <el-button @click="cancelSelection" size="small">取消</el-button>
      <el-button type="primary" @click="confirmSelection" size="small">确认</el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ScreenshotSelector',
  emits: ['screenshot-selected', 'cancel'],
  setup(props, { emit }) {
    const isVisible = ref(false)
    const isSelecting = ref(false)
    const hasSelection = ref(false)
    const isMoving = ref(false)
    const isResizing = ref(false)
    const resizeDirection = ref('')
    
    const selection = reactive({
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    })
    
    const moveStart = reactive({
      x: 0,
      y: 0,
      selectionStartX: 0,
      selectionStartY: 0,
      selectionEndX: 0,
      selectionEndY: 0
    })
    
    const resizeStart = reactive({
      x: 0,
      y: 0,
      selectionStartX: 0,
      selectionStartY: 0,
      selectionEndX: 0,
      selectionEndY: 0
    })
    
    const selectionBoxStyle = reactive({
      left: '0px',
      top: '0px',
      width: '0px',
      height: '0px'
    })
    
    // 显示选择器
    const show = () => {
      isVisible.value = true
    }
    
    // 隐藏选择器
    const hide = () => {
      isVisible.value = false
      isSelecting.value = false
      hasSelection.value = false
      isMoving.value = false
      isResizing.value = false
    }
    
    // 开始选择
    const startSelection = (event) => {
      isSelecting.value = true
      hasSelection.value = false
      isMoving.value = false
      isResizing.value = false
      
      selection.startX = event.clientX
      selection.startY = event.clientY
      selection.endX = event.clientX
      selection.endY = event.clientY
      
      updateSelectionBox()
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    
    // 开始移动选择区域
    const startMoveSelection = (event) => {
      isMoving.value = true
      isResizing.value = false
      
      moveStart.x = event.clientX
      moveStart.y = event.clientY
      moveStart.selectionStartX = selection.startX
      moveStart.selectionStartY = selection.startY
      moveStart.selectionEndX = selection.endX
      moveStart.selectionEndY = selection.endY
      
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', stopMove)
    }
    
    // 开始调整大小
    const startResize = (direction) => {
      isResizing.value = true
      isMoving.value = false
      resizeDirection.value = direction
      
      // 获取当前鼠标位置
      const event = window.event
      resizeStart.x = event.clientX
      resizeStart.y = event.clientY
      resizeStart.selectionStartX = selection.startX
      resizeStart.selectionStartY = selection.startY
      resizeStart.selectionEndX = selection.endX
      resizeStart.selectionEndY = selection.endY
      
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResize)
    }
    
    // 处理鼠标移动
    const handleMouseMove = (event) => {
      if (!isSelecting.value) return
      
      selection.endX = event.clientX
      selection.endY = event.clientY
      
      updateSelectionBox()
    }
    
    // 处理移动
    const handleMove = (event) => {
      if (!isMoving.value) return
      
      const deltaX = event.clientX - moveStart.x
      const deltaY = event.clientY - moveStart.y
      
      selection.startX = moveStart.selectionStartX + deltaX
      selection.startY = moveStart.selectionStartY + deltaY
      selection.endX = moveStart.selectionEndX + deltaX
      selection.endY = moveStart.selectionEndY + deltaY
      
      updateSelectionBox()
    }
    
    // 处理调整大小
    const handleResize = (event) => {
      if (!isResizing.value) return
      
      const deltaX = event.clientX - resizeStart.x
      const deltaY = event.clientY - resizeStart.y
      
      switch (resizeDirection.value) {
        case 'top':
          // 调整顶部边框，保持底部不变
          selection.startY = resizeStart.selectionStartY + deltaY
          break
        case 'bottom':
          // 调整底部边框，保持顶部不变
          selection.endY = resizeStart.selectionEndY + deltaY
          break
        case 'left':
          // 调整左侧边框，保持右侧不变
          selection.startX = resizeStart.selectionStartX + deltaX
          break
        case 'right':
          // 调整右侧边框，保持左侧不变
          selection.endX = resizeStart.selectionEndX + deltaX
          break
        case 'top-left':
          // 调整左上角，保持右下角不变
          selection.startX = resizeStart.selectionStartX + deltaX
          selection.startY = resizeStart.selectionStartY + deltaY
          break
        case 'top-right':
          // 调整右上角，保持左下角不变
          selection.endX = resizeStart.selectionEndX + deltaX
          selection.startY = resizeStart.selectionStartY + deltaY
          break
        case 'bottom-left':
          // 调整左下角，保持右上角不变
          selection.startX = resizeStart.selectionStartX + deltaX
          selection.endY = resizeStart.selectionEndY + deltaY
          break
        case 'bottom-right':
          // 调整右下角，保持左上角不变
          selection.endX = resizeStart.selectionEndX + deltaX
          selection.endY = resizeStart.selectionEndY + deltaY
          break
      }
      
      // 确保坐标顺序正确
      if (selection.startX > selection.endX) {
        [selection.startX, selection.endX] = [selection.endX, selection.startX]
      }
      if (selection.startY > selection.endY) {
        [selection.startY, selection.endY] = [selection.endY, selection.startY]
      }
      
      updateSelectionBox()
    }
    
    // 停止移动
    const stopMove = () => {
      isMoving.value = false
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', stopMove)
    }
    
    // 停止调整大小
    const stopResize = () => {
      isResizing.value = false
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    }
    
    // 处理鼠标释放
    const handleMouseUp = () => {
      if (!isSelecting.value) return
      
      isSelecting.value = false
      hasSelection.value = true
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    // 更新选择框样式
    const updateSelectionBox = () => {
      const left = Math.min(selection.startX, selection.endX)
      const top = Math.min(selection.startY, selection.endY)
      const width = Math.abs(selection.endX - selection.startX)
      const height = Math.abs(selection.endY - selection.startY)
      
      selectionBoxStyle.left = `${left}px`
      selectionBoxStyle.top = `${top}px`
      selectionBoxStyle.width = `${width}px`
      selectionBoxStyle.height = `${height}px`
    }
    
    // 取消选择
    const cancelSelection = () => {
      hide()
      emit('cancel')
    }
    
    // 确认选择
    const confirmSelection = () => {
      const bounds = {
        x: Math.min(selection.startX, selection.endX),
        y: Math.min(selection.startY, selection.endY),
        width: Math.abs(selection.endX - selection.startX),
        height: Math.abs(selection.endY - selection.startY)
      }
      
      hide()
      emit('screenshot-selected', bounds)
    }
    
    // 组件卸载时清理事件监听器
    onUnmounted(() => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', stopMove)
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    })
    
    return {
      isVisible,
      isSelecting,
      hasSelection,
      selectionBoxStyle,
      show,
      hide,
      startSelection,
      startMoveSelection,
      startResize,
      cancelSelection,
      confirmSelection
    }
  }
}
</script>

<style scoped>
.screenshot-selector {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  cursor: crosshair;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.selection-box {
  position: absolute;
  border: 2px solid #07c160;
  background-color: rgba(7, 193, 96, 0.2);
  cursor: move;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: white;
  border: 1px solid #07c160;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10001;
}

.resize-handle.top {
  top: 0;
  left: 50%;
  cursor: ns-resize;
}

.resize-handle.bottom {
  bottom: 0;
  left: 50%;
  cursor: ns-resize;
}

.resize-handle.left {
  top: 50%;
  left: 0;
  cursor: ew-resize;
}

.resize-handle.right {
  top: 50%;
  right: 0;
  cursor: ew-resize;
}

.resize-handle.top-left {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

.resize-handle.top-right {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

.resize-handle.bottom-left {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

.resize-handle.bottom-right {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

.bottom-toolbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10000;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>