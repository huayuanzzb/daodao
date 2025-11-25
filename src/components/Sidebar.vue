<template>
  <el-aside width="80px" class="sidebar">
    <!-- 当前用户头像 -->
    <div class="user-avatar">
      <div class="avatar-placeholder large">
        <span class="avatar-text">{{ getInitials(currentUserName) }}</span>
      </div>
    </div>
    
    <!-- 菜单 -->
    <div class="menu-container">
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="chat" class="menu-item">
          <div class="menu-item-content">
            <el-icon><ChatLineSquare /></el-icon>
            <span class="menu-text">聊天</span>
          </div>
        </el-menu-item>
        <el-menu-item index="contacts" class="menu-item">
          <div class="menu-item-content">
            <el-icon><User /></el-icon>
            <span class="menu-text">通讯录</span>
          </div>
        </el-menu-item>
      </el-menu>
      
      <!-- 自动填充空白区域 -->
      <div class="spacer"></div>
      
      <!-- 更多菜单 -->
      <div class="more-menu-container">
        <el-menu
          class="sidebar-menu"
          @select="handleMoreMenuSelect"
        >
          <el-menu-item index="more" class="menu-item" @click="toggleMoreMenu">
            <div class="menu-item-content">
              <el-icon><MoreFilled /></el-icon>
              <span class="menu-text">更多</span>
            </div>
          </el-menu-item>
        </el-menu>
        
        <!-- 更多菜单弹出框 -->
        <div v-if="showMoreMenu" class="more-menu-popup" ref="moreMenuRef">
          <el-menu
            class="more-menu"
            @select="handleMoreMenuItemSelect"
          >
            <el-menu-item index="settings">
              <el-icon><Setting /></el-icon>
              <span>设置</span>
            </el-menu-item>
            <el-menu-item index="about">
              <el-icon><InfoFilled /></el-icon>
              <span>关于</span>
            </el-menu-item>
            <el-menu-item index="logout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ChatLineSquare, User, MoreFilled, Setting, InfoFilled, SwitchButton } from '@element-plus/icons-vue'

export default {
  name: 'Sidebar',
  components: {
    ChatLineSquare,
    User,
    MoreFilled,
    Setting,
    InfoFilled,
    SwitchButton
  },
  props: {
    activeMenu: {
      type: String,
      default: 'chat'
    },
    currentUserName: {
      type: String,
      default: '用户'
    }
  },
  emits: ['menu-select', 'more-menu-select'],
  setup(props, { emit }) {
    const showMoreMenu = ref(false)
    const moreMenuRef = ref(null)
    
    // 获取用户姓名首字母
    const getInitials = (name) => {
      if (!name) return '';
      return name.charAt(0).toUpperCase();
    }
    
    // 处理菜单选择
    const handleMenuSelect = (index) => {
      emit('menu-select', index)
    }
    
    // 处理更多菜单选择
    const handleMoreMenuSelect = (index) => {
      // 这里我们只处理"更多"按钮的点击，不 emit 事件
    }
    
    // 处理更多菜单项选择
    const handleMoreMenuItemSelect = (index) => {
      showMoreMenu.value = false
      emit('more-menu-select', index)
    }
    
    // 切换更多菜单显示
    const toggleMoreMenu = () => {
      showMoreMenu.value = !showMoreMenu.value
    }
    
    // 点击其他地方关闭更多菜单
    const handleClickOutside = (event) => {
      if (moreMenuRef.value && !moreMenuRef.value.contains(event.target)) {
        showMoreMenu.value = false
      }
    }
    
    // 添加点击事件监听器
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    // 移除点击事件监听器
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      showMoreMenu,
      moreMenuRef,
      getInitials,
      handleMenuSelect,
      handleMoreMenuSelect,
      handleMoreMenuItemSelect,
      toggleMoreMenu
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #07c160;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.user-avatar {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-menu {
  background-color: transparent;
  border: none;
}

.menu-item {
  color: white;
  height: 60px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.menu-text {
  font-size: 12px;
  margin-top: 4px;
  line-height: 1;
}

.spacer {
  flex: 1;
}

.more-menu-container {
  position: relative;
}

.more-menu-popup {
  position: absolute;
  right: 0;
  bottom: 60px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 120px;
}

.more-menu {
  background-color: white;
  border: none;
}

.more-menu :deep(.el-menu-item) {
  color: #333;
  height: 40px;
  line-height: 40px;
  padding: 0 20px !important;
}

.more-menu :deep(.el-menu-item:hover) {
  background-color: #f5f5f5;
}

.more-menu :deep(.el-menu-item i) {
  margin-right: 8px;
}

/* 修复 Element Plus 菜单项的默认内边距问题 */
.sidebar-menu :deep(.el-menu-item) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  text-align: center;
}

/* 确保图标和文字正确布局 */
.menu-item :deep(.el-icon) {
  width: 20px;
  height: 20px;
  font-size: 20px;
}

/* 头像占位符样式 */
.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: white;
  color: #07c160;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-placeholder.large {
  width: 50px;
  height: 50px;
}

.avatar-text {
  color: #07c160;
  font-weight: bold;
  font-size: 18px;
}
</style>