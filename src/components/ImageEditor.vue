<template>
  <div class="image-editor" v-if="isVisible">
    <div class="editor-container">
      <div class="editor-header">
        <h3>编辑图片</h3>
        <div class="editor-toolbar">
          <el-button 
            v-for="tool in tools" 
            :key="tool.name"
            :type="activeTool === tool.name ? 'primary' : 'default'"
            @click="selectTool(tool.name)"
            :icon="tool.icon"
            size="small"
          >
            {{ tool.label }}
          </el-button>
          <el-color-picker v-model="strokeColor" size="small"></el-color-picker>
          <el-slider v-model="strokeWidth" :min="1" :max="20" size="small" style="width: 100px;"></el-slider>
          <div class="spacer"></div>
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确认</el-button>
        </div>
      </div>
      <div class="editor-canvas-container">
        <canvas 
          ref="canvasRef"
          class="editor-canvas"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'

export default {
  name: 'ImageEditor',
  props: {
    imageSrc: {
      type: String,
      default: ''
    }
  },
  emits: ['edit-complete', 'cancel'],
  setup(props, { emit }) {
    const isVisible = ref(false)
    const canvasRef = ref(null)
    const ctx = ref(null)
    
    const activeTool = ref('select')
    const strokeColor = ref('#FF0000')
    const strokeWidth = ref(3)
    
    const isDrawing = ref(false)
    const startX = ref(0)
    const startY = ref(0)
    
    const tools = [
      { name: 'select', label: '选择', icon: 'Select' },
      { name: 'rectangle', label: '矩形', icon: 'Rectangle' },
      { name: 'circle', label: '圆形', icon: 'Circle' },
      { name: 'line', label: '直线', icon: 'Minus' },
      { name: 'text', label: '文字', icon: 'Edit' }
    ]
    
    // 显示编辑器
    const show = () => {
      isVisible.value = true
    }
    
    // 隐藏编辑器
    const hide = () => {
      isVisible.value = false
    }
    
    // 选择工具
    const selectTool = (toolName) => {
      activeTool.value = toolName
    }
    
    // 初始化画布
    const initCanvas = () => {
      if (!canvasRef.value || !props.imageSrc) return
      
      const canvas = canvasRef.value
      ctx.value = canvas.getContext('2d')
      
      const img = new Image()
      img.onload = () => {
        // 设置画布尺寸
        canvas.width = img.width
        canvas.height = img.height
        
        // 绘制原始图片
        ctx.value.drawImage(img, 0, 0)
      }
      img.src = props.imageSrc
    }
    
    // 处理鼠标按下
    const handleMouseDown = (event) => {
      if (activeTool.value === 'select') return
      
      isDrawing.value = true
      const rect = canvasRef.value.getBoundingClientRect()
      startX.value = event.clientX - rect.left
      startY.value = event.clientY - rect.top
    }
    
    // 处理鼠标移动
    const handleMouseMove = (event) => {
      if (!isDrawing.value || activeTool.value === 'select') return
      
      const rect = canvasRef.value.getBoundingClientRect()
      const currentX = event.clientX - rect.left
      const currentY = event.clientY - rect.top
      
      // 重新绘制原始图片以清除之前的绘制
      initCanvas()
      
      // 绘制当前形状
      drawShape(startX.value, startY.value, currentX, currentY)
    }
    
    // 处理鼠标释放
    const handleMouseUp = (event) => {
      if (!isDrawing.value || activeTool.value === 'select') return
      
      isDrawing.value = false
      const rect = canvasRef.value.getBoundingClientRect()
      const endX = event.clientX - rect.left
      const endY = event.clientY - rect.top
      
      // 绘制最终形状
      drawShape(startX.value, startY.value, endX, endY)
    }
    
    // 绘制形状
    const drawShape = (x1, y1, x2, y2) => {
      if (!ctx.value) return
      
      ctx.value.strokeStyle = strokeColor.value
      ctx.value.lineWidth = strokeWidth.value
      ctx.value.lineCap = 'round'
      ctx.value.lineJoin = 'round'
      
      switch (activeTool.value) {
        case 'rectangle':
          ctx.value.strokeRect(x1, y1, x2 - x1, y2 - y1)
          break
        case 'circle':
          const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
          ctx.value.beginPath()
          ctx.value.arc(x1, y1, radius, 0, 2 * Math.PI)
          ctx.value.stroke()
          break
        case 'line':
          ctx.value.beginPath()
          ctx.value.moveTo(x1, y1)
          ctx.value.lineTo(x2, y2)
          ctx.value.stroke()
          break
        case 'text':
          const text = prompt('请输入文字:')
          if (text) {
            ctx.value.fillStyle = strokeColor.value
            ctx.value.font = `${strokeWidth.value * 5}px Arial`
            ctx.value.fillText(text, x1, y1)
          }
          break
      }
    }
    
    // 取消编辑
    const cancelEdit = () => {
      hide()
      emit('cancel')
    }
    
    // 确认编辑
    const confirmEdit = () => {
      if (canvasRef.value) {
        const dataUrl = canvasRef.value.toDataURL('image/png')
        hide()
        emit('edit-complete', dataUrl)
      }
    }
    
    // 监听图片源变化
    watch(() => props.imageSrc, () => {
      if (isVisible.value) {
        initCanvas()
      }
    })
    
    // 组件挂载后初始化画布
    onMounted(() => {
      if (props.imageSrc) {
        initCanvas()
      }
    })
    
    return {
      isVisible,
      canvasRef,
      activeTool,
      strokeColor,
      strokeWidth,
      tools,
      show,
      hide,
      selectTool,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      cancelEdit,
      confirmEdit
    }
  }
}
</script>

<style scoped>
.image-editor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.editor-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.spacer {
  flex: 1;
}

.editor-canvas-container {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.editor-canvas {
  max-width: 100%;
  max-height: 100%;
  border: 1px solid #e0e0e0;
}
</style>