<template>
  <el-aside width="250px" class="sidebar">
    <div class="sidebar-header">
      <el-input
        :value="searchText"
        @input="updateSearchText"
        placeholder="搜索"
        size="small"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="sidebar-content">
      <el-menu
        :default-active="activeChat"
        class="chat-list"
        @select="handleChatSelect"
      >
        <el-menu-item
          v-for="chat in filteredChats"
          :key="chat.id"
          :index="chat.id"
          class="chat-item"
        >
          <!-- 使用用户姓名首字母代替头像 -->
          <div class="avatar-placeholder">
            <span class="avatar-text">{{ getInitials(chat.name) }}</span>
          </div>
          <div class="chat-info">
            <div class="chat-name">{{ chat.name }}</div>
            <div class="chat-preview">{{ chat.preview }}</div>
          </div>
          <div class="chat-time">{{ chat.time }}</div>
        </el-menu-item>
      </el-menu>
    </div>
  </el-aside>
</template>

<script>
import { computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'ChatList',
  components: {
    Search
  },
  props: {
    chats: {
      type: Array,
      required: true
    },
    activeChat: {
      type: String,
      required: true
    },
    searchText: {
      type: String,
      required: true
    }
  },
  emits: ['update:searchText', 'select-chat'],
  setup(props, { emit }) {
    // 过滤聊天列表
    const filteredChats = computed(() => {
      if (!props.searchText) {
        return props.chats
      }
      return props.chats.filter(chat =>
        chat.name.toLowerCase().includes(props.searchText.toLowerCase())
      )
    })

    // 获取用户姓名首字母
    const getInitials = (name) => {
      if (!name) return '';
      return name.charAt(0).toUpperCase();
    }

    // 处理聊天选择
    const handleChatSelect = (index) => {
      emit('select-chat', index)
    }

    const updateSearchText = (value) => {
      emit('update:searchText', value)
    }

    return {
      filteredChats,
      getInitials,
      handleChatSelect,
      updateSearchText
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.chat-list {
  border: none;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px !important;
  height: 60px !important;
}

.chat-info {
  flex: 1;
  margin-left: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
}

.chat-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.chat-preview {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.chat-time {
  font-size: 12px;
  color: #999;
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

.avatar-text {
  color: white;
  font-weight: bold;
  font-size: 16px;
}
</style>