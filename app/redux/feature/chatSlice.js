import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
  },
  reducers: {
    // 設定聊天清單
    setChats: (state, action) => {
      state.chats = action.payload;
    
    },

    // 新增聊天（避免重複）
    addChat: (state, action) => {
      const exists = state.chats.some(chat => chat.id === action.payload.id);
      if (!exists) {
        state.chats.unshift(action.payload);
      }
    },

    // 更新聊天內容（根據 id 替換）
    updateChat: (state, action) => {
      const index = state.chats.findIndex(chat => chat.id === action.payload.id);
      if (index !== -1) {
        state.chats[index] = action.payload;
      }
    },


    // 標記聊天為已讀
    markChatAsRead: (state, action) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat && chat.unreadCounts) {
        chat.unreadCounts[action.meta.uid] = 0;
      }
    },
  },
});

export const { setChats, addChat, updateChat, markChatAsRead } = chatSlice.actions;
export default chatSlice.reducer;
