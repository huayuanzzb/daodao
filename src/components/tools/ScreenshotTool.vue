<template>
  <el-tooltip content="截屏" placement="top">
    <el-button class="toolbar-btn" @click="handleClick" :loading="loading">
      <el-icon><Scissor /></el-icon>
    </el-button>
  </el-tooltip>
  
  <!-- 截图选择器 -->
  <ScreenshotSelector 
    ref="selectorRef"
    @screenshot-selected="handleScreenshotSelected"
    @cancel="handleCancelSelection"
  />
  
  <!-- 图片编辑器 -->
  <ImageEditor 
    ref="editorRef"
    :image-src="currentImage"
    @edit-complete="handleEditComplete"
    @cancel="handleCancelEdit"
  />
</template>

<script>
import { ref } from 'vue'
import { Scissor } from '@element-plus/icons-vue'
import ScreenshotSelector from '../ScreenshotSelector.vue'
import ImageEditor from '../ImageEditor.vue'

export default {
  name: 'ScreenshotTool',
  components: {
    Scissor,
    ScreenshotSelector,
    ImageEditor
  },
  emits: ['screenshot-taken'],
  setup(props, { emit }) {
    const loading = ref(false)
    const selectorRef = ref(null)
    const editorRef = ref(null)
    const currentImage = ref('')
    
    const handleClick = async () => {
      // 显示区域选择器并直接开始截图
      if (selectorRef.value) {
        selectorRef.value.show()
        // 触发选择器开始选择
        setTimeout(() => {
          // 模拟鼠标按下事件开始选择
          const overlay = document.querySelector('.overlay')
          if (overlay) {
            const event = new MouseEvent('mousedown', {
              view: window,
              bubbles: true,
              cancelable: true,
              clientX: window.innerWidth / 2,
              clientY: window.innerHeight / 2
            })
            overlay.dispatchEvent(event)
          }
        }, 100)
      }
    }
    
    // 处理截图区域选择完成
    const handleScreenshotSelected = async (bounds) => {
      loading.value = true
      try {
        // 调用主进程进行区域截图
        const result = await window.electronAPI.takeRegionScreenshot(bounds)
        
        if (result.success) {
          // 在渲染进程中裁剪图像
          const croppedImage = await cropImage(result.image, result.bounds, result.screenSize)
          // 显示图片编辑器
          currentImage.value = croppedImage
          if (editorRef.value) {
            editorRef.value.show()
          }
        } else {
          console.error('截图失败:', result.error)
        }
      } catch (error) {
        console.error('截图失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    // 在渲染进程中裁剪图像
    const cropImage = (imageSrc, bounds, screenSize) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          // 创建画布
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // 设置画布尺寸为裁剪区域的尺寸
          canvas.width = bounds.width
          canvas.height = bounds.height
          
          // 计算缩放比例
          const scaleX = img.width / screenSize.width
          const scaleY = img.height / screenSize.height
          
          // 在画布上绘制裁剪区域
          ctx.drawImage(
            img,
            bounds.x * scaleX, bounds.y * scaleY, bounds.width * scaleX, bounds.height * scaleY, // 源区域
            0, 0, bounds.width, bounds.height // 目标区域
          )
          
          // 返回裁剪后的图像
          resolve(canvas.toDataURL('image/png'))
        }
        img.src = imageSrc
      })
    }
    
    // 处理取消选择
    const handleCancelSelection = () => {
      // 什么都不做，选择器已经隐藏
    }
    
    // 处理编辑完成
    const handleEditComplete = (editedImage) => {
      // 创建截图对象
      const screenshotData = {
        timestamp: new Date().toISOString(),
        image: editedImage,
        type: 'screenshot'
      }
      
      // 发出截图完成事件
      emit('screenshot-taken', screenshotData)
    }
    
    // 处理取消编辑
    const handleCancelEdit = () => {
      // 什么都不做，编辑器已经隐藏
    }
    
    return {
      loading,
      selectorRef,
      editorRef,
      currentImage,
      handleClick,
      handleScreenshotSelected,
      handleCancelSelection,
      handleEditComplete,
      handleCancelEdit
    }
  }
}
</script>

<style scoped>
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
</style>