"use client";
import React, { useState,useEffect ,useMemo } from "react";
import { useSelector } from "react-redux";
import ChatListSidebar from "./ChatListSidebar";
import ChatContent from "./ChatContent";
import { updateUserData } from "@/services/userService";
import "./ChatWindow.css";

const ChatWindow = ({ onClose }) => {
   

    const [selectedChat, setSelectedChat] = useState(null);
    const chats = useSelector((state) => state.chat.chats);
    const currentUser = useSelector((state) => state.user.user);
    const unreadCount = useMemo(() => {
        return chats.reduce((total, chat) => {
          const count = chat.unreadCounts?.[currentUser?.uid] || 0;
          return total + count;
        }, 0);
      }, [chats, currentUser?.uid]);

     
      const handleOverlayClick =  async (e) => {

        if (e.target.classList.contains("chatWindow-overlay")) {
            if (currentUser?.uid) {
                await updateUserData(currentUser.uid, { currentOpenChatId: null });
            }
            onClose();
        }
    };

     // 如果使用者直接跳頁或關掉 chat 視窗，也安全清除 currentOpenChatId
     useEffect(() => {
        return () => {
            if (currentUser?.uid) {
                updateUserData(currentUser.uid, { currentOpenChatId: null });
            }
        };
    }, []);
    

    return (
        <div className="chatWindow-overlay" onClick={handleOverlayClick} >
            <div className="chatWindow-container" onClick={(e) => e.stopPropagation()}>
                <div className="chatWindow-header">
                    <button className="chatWindow-tab active">
                        全部訊息 <span className="badge"> {unreadCount > 9 ? "9+" : unreadCount}</span>
                    </button>
                    <button className="chatWindow-tab">
                        <img src="/images/icons8-group-64-1.png" alt="訊息分類圖示" className="chatWindow-category-icon" />
                        訊息分類
                    </button>
                </div>

                <div className="chatWindow-body">
                    <div className="chatWindow-sidebar-container">
                        <ChatListSidebar onSelectChat={setSelectedChat}/>
                    </div>
                    <div className="chatWindow-content-container">
                        <ChatContent chat={selectedChat}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;

