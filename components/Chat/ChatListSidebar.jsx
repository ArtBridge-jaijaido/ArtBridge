import React from "react";
import { useSelector } from "react-redux";
import ChatListItem from "./ChatListItem";
import "./ChatListSidebar.css";



const ChatListSidebar = ({ onSelectChat }) => {


  const chats = useSelector((state) => state.chat.chats);
  const allUsers = useSelector((state) => state.user.allUsers);
  const currentUser = useSelector((state) => state.user.user);
  
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
        {chats.map((chat) => {
          const otherUid = chat.participants.find((uid) => uid !== currentUser?.uid);
          const otherUser = allUsers?.[otherUid];
          const avatarUrl = otherUser?.profileAvatar || "/images/default-avatar.png";
          const nickname = otherUser?.nickname || "未知用戶";
          const lastMessage = chat.lastMessage || "";
          const time = chat.lastUpdated
          ? new Date(chat.lastUpdated).toLocaleTimeString("zh-TW", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "";
          const unreadCount = chat.unreadCounts?.[currentUser?.uid] || 0;


          return (
            <div onClick={() => onSelectChat(chat)} key={chat.id}>
              <ChatListItem
                avatar={avatarUrl}
                username={nickname}
                lastMessage={lastMessage}
                lastMessageTime={time}
                unreadCount={unreadCount}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};



export default ChatListSidebar;
