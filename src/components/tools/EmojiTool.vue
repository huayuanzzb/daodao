<template>
  <el-tooltip content="表情" placement="top">
    <el-button class="toolbar-btn" @click="handleClick">
      <el-icon><Picture /></el-icon>
    </el-button>
  </el-tooltip>
</template>

<script>
import { Picture } from '@element-plus/icons-vue'

export default {
  name: 'EmojiTool',
  components: {
    Picture
  },
  emits: ['emoji-selected'],
  setup(props, { emit }) {
    const handleClick = () => {
      // 这里可以添加表情选择器的逻辑
      console.log('表情按钮点击')
      // 模拟选择了一个表情
      emit('emoji-selected', '😊')
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