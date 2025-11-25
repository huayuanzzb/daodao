<template>
  <el-tooltip content="发送文件" placement="top">
    <el-button class="toolbar-btn" @click="handleClick">
      <el-icon><FolderOpened /></el-icon>
    </el-button>
  </el-tooltip>
</template>

<script>
import { FolderOpened } from '@element-plus/icons-vue'

export default {
  name: 'FileTool',
  components: {
    FolderOpened
  },
  emits: ['file-selected'],
  setup(props, { emit }) {
    const handleClick = () => {
      // 这里可以添加文件选择和发送的逻辑
      console.log('发送文件按钮点击')
      // 模拟选择了一个文件
      emit('file-selected', { name: 'example.txt', size: 1024 })
    }
    
    return {
      handleClick
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