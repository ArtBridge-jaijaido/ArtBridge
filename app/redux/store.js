import { configureStore } from '@reduxjs/toolkit';
import userReducer from './feature/userSlice.js'; 
import artworkReducer from './feature/artworkSlice.js';
import painterPortfolioReducer from './feature/painterPortfolioSlice.js'
import painterArticleReducer from './feature/painterArticleSlice.js';
import entrustReducer from './feature/entrustSlice.js'; 


import artworkOrderReducer from './feature/artworkOrderSlice.js'; // 引入作品訂單的 reducer
import notificationReducer from './feature/notificationSlice'


export const store = configureStore({
  reducer: {

    user: userReducer, // 添加用戶狀態管理的 reducer
    artwork: artworkReducer, // 添加作品狀態管理的 reducer
    painterPortfolio: painterPortfolioReducer, // 添加畫師作品集狀態管理的 reducer
    painterArticle: painterArticleReducer, // 添加畫家文章狀態管理的 reducer
    entrust: entrustReducer, // 添加委託狀態管理的 reducer

    artworkOrder: artworkOrderReducer, // 添加作品訂單狀態管理的 reducer
    notifications: notificationReducer, // 添加通知狀態管理的 reducer

 
  },
});