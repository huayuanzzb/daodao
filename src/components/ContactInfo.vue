<template>
  <el-aside width="200px" class="info-sidebar" v-if="currentChat">
    <div class="info-header">
      <!-- 使用用户姓名首字母代替头像 -->
      <div class="avatar-placeholder large">
        <span class="avatar-text">{{ getInitials(currentChat.name) }}</span>
      </div>
      <h3>{{ currentChat.name }}</h3>
    </div>
    <div class="info-content">
      <p>在线状态: {{ currentChat.status }}</p>
    </div>
  </el-aside>
</template>

<script>
export default {
  name: 'ContactInfo',
  props: {
    currentChat: {
      type: Object,
      default: null
    }
  },
  setup() {
    // 获取用户姓名首字母
    const getInitials = (name) => {
      if (!name) return '';
      return name.charAt(0).toUpperCase();
    }

    return {
      getInitials
    }
  }
}
</script>

<style scoped>
.info-sidebar {
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.info-header {
  text-align: center;
  margin-bottom: 20px;
}

.info-content {
  width: 100%;
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

.avatar-placeholder.large {
  width: 60px;
  height: 60px;
}

.avatar-text {
  color: white;
  font-weight: bold;
  font-size: 16px;
}
</style>