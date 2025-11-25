<template>
  <div class="app-container">
    <el-container class="main-container">
      <!-- 左侧边栏 -->
      <Sidebar 
        :active-menu="activeMenu" 
        :current-user-name="currentUserName"
        @menu-select="handleMenuSelect"
        @more-menu-select="handleMoreMenuSelect"
      />
      
      <!-- 右侧内容区域 -->
      <el-container class="content-container">
        <!-- 主体内容 -->
        <el-main class="main-content">
          <!-- 聊天界面 -->
          <div v-if="activeMenu === 'chat'" class="chat-container">
            <!-- 左侧聊天列表 -->
            <ChatList 
              :chats="chats" 
              :active-chat="activeChat" 
              :search-text="searchText" 
              @update:searchText="searchText = $event"
              @select-chat="handleChatSelect"
            />
            
            <!-- 中间聊天内容 -->
            <ChatContent 
              :current-chat="currentChat" 
              :messages="messages" 
              :chats="chats" 
              :active-chat="activeChat" 
              @send-message="handleSendMessage"
            />
          </div>
          
          <!-- 通讯录界面 -->
          <div v-else-if="activeMenu === 'contacts'" class="contacts-container">
            <div class="contacts-content">
              <h2>通讯录</h2>
              <p>通讯录功能待实现</p>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ChatList from './components/ChatList.vue'
import ChatContent from './components/ChatContent.vue'
import ContactInfo from './components/ContactInfo.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    ChatList,
    ChatContent,
    ContactInfo
  },
  setup() {
    // 当前激活的菜单
    const activeMenu = ref('chat')
    
    // 当前用户名
    const currentUserName = ref('张三')
    
    // 搜索文本
    const searchText = ref('')
    
    // 当前活跃的聊天
    const activeChat = ref('1')
    
    // 模拟聊天列表数据
    const chats = ref([
      {
        id: '1',
        name: '张三',
        preview: '你好，在吗？',
        time: '10:30',
        status: '在线'
      },
      {
        id: '2',
        name: '李四',
        preview: '明天见',
        time: '昨天',
        status: '离线'
      },
      {
        id: '3',
        name: '工作群',
        preview: '[文件]项目进度报告',
        time: '昨天',
        status: '9人在线'
      }
    ])
    
    // 模拟消息数据
    const messages = ref([
      {
        id: '1',
        sender: 'other',
        text: '你好，在吗？',
        time: '10:25'
      },
      {
        id: '2',
        sender: 'me',
        text: '在的，有什么事吗？',
        time: '10:26'
      },
      {
        id: '3',
        sender: 'other',
        text: '想问一下项目的进度怎么样了？',
        time: '10:28'
      }
    ])
    
    // 当前聊天对象
    const currentChat = computed(() => {
      return chats.value.find(chat => chat.id === activeChat.value)
    })
    
    // 头部标题
    const headerTitle = computed(() => {
      return activeMenu.value === 'chat' ? '聊天' : '通讯录'
    })
    
    // 处理菜单选择
    const handleMenuSelect = (index) => {
      activeMenu.value = index
    }
    
    // 处理更多菜单选择
    const handleMoreMenuSelect = (index) => {
      switch (index) {
        case 'settings':
          showSettings()
          break
        case 'about':
          alert('关于功能待实现')
          break
        case 'logout':
          alert('退出功能待实现')
          break
      }
    }
    
    // 处理聊天选择
    const handleChatSelect = (index) => {
      activeChat.value = index
    }
    
    // 处理发送消息
    const handleSendMessage = (message) => {
      messages.value.push(message)
    }
    
    // 显示设置
    const showSettings = () => {
      alert('设置功能待实现')
    }
    
    return {
      activeMenu,
      currentUserName,
      searchText,
      activeChat,
      chats,
      messages,
      currentChat,
      headerTitle,
      handleMenuSelect,
      handleMoreMenuSelect,
      handleChatSelect,
      handleSendMessage,
      showSettings
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
}

.main-container {
  flex: 1;
  flex-direction: row;
}

.content-container {
  flex: 1;
  flex-direction: column;
}

.app-header {
  background-color: #07c160;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  margin: 0;
  font-size: 1.5em;
}

.main-content {
  padding: 0;
  background-color: #f5f5f5;
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chat-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.contacts-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.contacts-content {
  text-align: center;
  color: #666;
}
</style>