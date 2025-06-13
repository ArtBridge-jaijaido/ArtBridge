import { configureStore } from "@reduxjs/toolkit";
import artworkOrderReducer from "./feature/artworkOrderSlice.js"; // 引入作品訂單的 reducer
import artworkReducer from "./feature/artworkSlice.js";
import chatReducer from "./feature/chatSlice.js"; // 引入聊天的 reducer
import entrustReducer from "./feature/entrustSlice.js";
import messageReducer from "./feature/messageSlice.js"; // 引入訊息的 reducer
import notificationReducer from "./feature/notificationSlice.js"; // 引入通知的 reducer
import painterArticleReducer from "./feature/painterArticleSlice.js";
import painterPortfolioReducer from "./feature/painterPortfolioSlice.js";
import userReducer from "./feature/userSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer, // 添加用戶狀態管理的 reducer
    artwork: artworkReducer, // 添加作品狀態管理的 reducer
    painterPortfolio: painterPortfolioReducer, // 添加畫師作品集狀態管理的 reducer
    painterArticle: painterArticleReducer, // 添加畫家文章狀態管理的 reducer
    entrust: entrustReducer, // 添加委託狀態管理的 reducer
    artworkOrder: artworkOrderReducer, // 添加作品訂單狀態管理的 reducer
    notifications: notificationReducer, // 添加通知狀態管理的 reducer
    chat: chatReducer, // 添加聊天狀態管理的 reducer
    messages: messageReducer, // 添加訊息狀態管理的 reducer
  },
});
