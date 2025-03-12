import { configureStore } from '@reduxjs/toolkit';
import userReducer from './feature/userSlice.js'; 
import artworkReducer from './feature/artworkSlice.js';
import painterPortfolioReducer from './feature/painterPortfolioSlice.js'
import painterArticleReducer from './feature/painterArticleSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer, // 添加用戶狀態管理的 reducer
    artwork: artworkReducer, // 添加作品狀態管理的 reducer
    painterPortfolio: painterPortfolioReducer, // 添加畫師作品集狀態管理的 reducer
    painterArticle: painterArticleReducer, // 添加畫家文章狀態管理的 reducer

  },
});
