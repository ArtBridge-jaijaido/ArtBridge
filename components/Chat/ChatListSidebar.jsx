import React from "react";
import ChatListItem from "./ChatListItem";
import "./ChatListSidebar.css";

const mockChatList = [
  {
    id: 1,
    username: "使用者 A",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "這是一則來自使用者 A 的訊息這是一則來自使用者 A 的訊息這是一則來自使用者 A 的訊息這是一則來自使用者 A 的訊息...",
    time: "13:59",
    unreadCount: 3,
  },
  {
    id: 2,
    username: "使用者 B",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "嗨你好，有關作品的問題想詢問～",
    time: "13:21",
    unreadCount: 0,
  },
  {
    id: 3,
    username: "使用者 C",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "請問可以修改這個部分嗎？",
    time: "12:45",
    unreadCount: 1,
  },
  {
    id: 4,
    username: "使用者 D",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "已收到，非常感謝～",
    time: "12:30",
    unreadCount: 0,
  },
  {
    id: 5,
    username: "使用者 E",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "目前進度大約到哪裡呢？",
    time: "11:50",
    unreadCount: 4,
  },
  {
    id: 6,
    username: "使用者 F",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "這邊有幾張參考圖可以提供",
    time: "11:20",
    unreadCount: 0,
  },
  {
    id: 7,
    username: "使用者 G",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "好期待你的作品！",
    time: "10:35",
    unreadCount: 2,
  },
  {
    id: 8,
    username: "使用者 H",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "已付款，請查收！",
    time: "10:20",
    unreadCount: 0,
  },
  {
    id: 9,
    username: "使用者 I",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "有問題我再跟你聯絡 🙏",
    time: "09:10",
    unreadCount: 6,
  },
  {
    id: 10,
    username: "使用者 J",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "你好，我想委託一張插畫",
    time: "08:59",
    unreadCount: 9,
  },
  {
    id: 11,
    username: "使用者 H",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "已付款，請查收！",
    time: "10:20",
    unreadCount: 0,
  },
  {
    id: 12,
    username: "使用者 I",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "有問題我再跟你聯絡 🙏",
    time: "09:10",
    unreadCount: 6,

  },
  {
    id: 13,
    username: "使用者 J",
    avatarUrl: "/images/testing-artist-profile-image.png", 
    preview: "你好，我想委託一張插畫",
    time: "08:59",
    unreadCount: 9,
  },
];

const ChatListSidebar = ({ onSelectChat }) => {
  return (
    <div className="chatListSidebar">
      <div className="chatListSidebar-searchBar">
        <input
          type="text"
          className="chatListSidebar-searchInput"
          placeholder="搜尋訊息..."
        />
        <span className="chatListSidebar-searchIcon">🔍</span>
      </div>

      <div className="chatListSidebar-list">
        {mockChatList.map((chat) => (
        <div onClick={() => onSelectChat(chat)} key={chat.id}>
          <ChatListItem
            avatar={chat.avatarUrl}
            username={chat.username}
            lastMessage={chat.preview}
            lastMessageTime={chat.time}
            unreadCount={chat.unreadCount}
          />
        </div>
        ))}
      </div>
    </div>
  );
};



export default ChatListSidebar;
