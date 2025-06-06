"use client";
import React from "react";
import "./ChatOpenButton.css";

const ChatOpenButton = ({ onClick, unreadCount = 0 }) => {
  return (
    <button className="ChatOpenButton-btn" onClick={onClick}>
      <img src="/images/icons8-message-96-8.png" alt="Chat Icon" className="ChatOpenButton-icon" />
      { (
        <span className="ChatOpenButton-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
      )}
    </button>
  );
};

export default ChatOpenButton;
