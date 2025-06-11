import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messageMap: {}, // { [chatId]: [messages...] }
  },
  reducers: {
    
    // 設定某個聊天室的所有訊息
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messageMap[chatId] = messages;
    },

    // 為某個聊天室新增一則訊息
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messageMap[chatId]) {
        state.messageMap[chatId] = [];
      }
      // 避免重複訊息
      const exists = state.messageMap[chatId].some((m) => m.id === message.id);
      if (!exists) {
        state.messageMap[chatId].push(message);
      }
    },

    // 清除所有訊息（登出時使用）
    clearMessages: (state) => {
      state.messageMap = {};
    }
  },
});

export const { setMessages, addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
