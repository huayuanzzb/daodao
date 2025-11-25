<template>
  <el-tooltip content="远程协助" placement="top">
    <el-button class="toolbar-btn" @click="handleClick">
      <el-icon><Service /></el-icon>
    </el-button>
  </el-tooltip>
</template>

<script>
import { Service } from '@element-plus/icons-vue'

export default {
  name: 'RemoteAssistTool',
  components: {
    Service
  },
  emits: ['remote-assist-requested'],
  setup(props, { emit }) {
    const handleClick = () => {
      // 这里可以添加远程协助的逻辑
      console.log('远程协助按钮点击')
      // 模拟发起远程协助请求
      emit('remote-assist-requested', { requestId: Date.now() })
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