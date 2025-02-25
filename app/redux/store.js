import { configureStore } from '@reduxjs/toolkit';
import userReducer from './feature/userSlice.js'; 
import artworkReducer from './feature/artworkSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer, // 添加用戶狀態管理的 reducer
    artwork: artworkReducer, // 添加作品狀態管理的 reducer
  },
});
