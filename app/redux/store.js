import { configureStore } from '@reduxjs/toolkit';
import userReducer from './feature/userSlice.js'; 

export const store = configureStore({
  reducer: {
    user: userReducer, // 添加用戶狀態管理的 reducer
  },
});
