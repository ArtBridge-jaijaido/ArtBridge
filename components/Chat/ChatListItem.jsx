"use client";
import React from "react";
import "./ChatListItem.css";

const ChatListItem = ({ avatar, username, lastMessage, lastMessageTime, unreadCount }) => {
    
    console.log(lastMessageTime, "lastMessageTime");
    return (
        <div className="ChatListItem-container">
            <div className="ChatListItem-avatar">
                <img src={avatar} alt="avatar" />
            </div>
            <div className="ChatListItem-user">

                <div className="ChatListItem-info">
                    <p className="ChatListItem-username">{username}</p>
                    <p className="ChatListItem-last">{lastMessage}</p>
                </div>
                <div className="ChatListItem-meta">
                    <span className="ChatListItem-time">{lastMessageTime}</span>
                    <span className="ChatListItem-badge">
                        {unreadCount > 0 ? (unreadCount > 9 ? "9+" : unreadCount) : ""}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;
