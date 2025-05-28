// app/redux/feature/notificationSlice.js

import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],         // 所有通知資料
    unreadCount: 0     // 未讀通知數（用來顯示紅點）
  },
  reducers: {
    // 設定通知清單
    setNotifications: (state, action) => {
      state.items = action.payload
      state.unreadCount = action.payload.filter(n => !n.isRead).length
    },

    // 將所有通知標記為已讀
    markAllAsRead: (state) => {
      state.items = state.items.map(n => ({ ...n, isRead: true }))
      state.unreadCount = 0
    },

     // 新增通知（避免重複）
     addNotification: (state, action) => {
      const exists = state.items.some(n => n.id === action.payload.id)
      if (!exists) {
        state.items.unshift(action.payload)
        if (!action.payload.isRead) {
          state.unreadCount += 1
        }
      }
    },

    // 更新通知內容（根據 id 替換）
    updateNotification: (state, action) => {
      state.items = state.items.map(n =>
        n.id === action.payload.id ? action.payload : n
      )
      state.unreadCount = state.items.filter(n => !n.isRead).length
    }
  }
})

export const { setNotifications, markAllAsRead,addNotification, updateNotification } = notificationSlice.actions
export default notificationSlice.reducer
