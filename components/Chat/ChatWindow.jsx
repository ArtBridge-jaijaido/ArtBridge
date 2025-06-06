import React, { useState } from "react";
import ChatListSidebar from "./ChatListSidebar";
import ChatContent from "./ChatContent";
import "./ChatWindow.css";

const ChatWindow = ({ onClose }) => {
    const handleOverlayClick = (e) => {

        if (e.target.classList.contains("chatWindow-overlay")) {
            onClose();
        }
    };

    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="chatWindow-overlay" onClick={handleOverlayClick} >
            <div className="chatWindow-container" onClick={(e) => e.stopPropagation()}>
                <div className="chatWindow-header">
                    <button className="chatWindow-tab active">
                        全部訊息 <span className="badge">9+</span>
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

