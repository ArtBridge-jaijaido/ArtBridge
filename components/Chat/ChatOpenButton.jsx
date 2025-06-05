"use client";
import React from "react";
import "./ChatOpenButton.css";

const ChatFloatingButton = ({ onClick, unreadCount = 0 }) => {
  return (
    <button className="chat-float-btn" onClick={onClick}>
      💬
      {unreadCount > 0 && (
        <span className="chat-float-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
      )}
    </button>
  );
};

export default ChatFloatingButton;
