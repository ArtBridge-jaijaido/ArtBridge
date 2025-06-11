"use client";
import React from "react";
import "./ChatMessageItem.css";

const MessageItem = ({ message, isOwn }) => {
  const { type = "text", text, payload, createdAt } = message;

  const time = new Date(createdAt).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const renderContent = () => {
    switch (type) {
      case "text":
        return <div className="ChatMessage-text">{text}</div>;

      case "image":
        return (
          <div className="ChatMessage-image-wrapper">
            <img src={message.imageUrl} alt="圖片" />
          </div>
        );

      case "system":
        return <div className="ChatMessage-system">{text}</div>;

      case "milestoneNotice":
        return (
          <div className="ChatMessage-milestone-notice">
            <p className="title">繪師已選擇開始時間</p>
            <p>案件開始時間：{payload?.startDate}</p>
            <p className="highlight">
              請於 {payload?.deadline} 前付款
            </p>
          </div>
        );

      default:
        return <div className="ChatMessage-unknown">[未知訊息]</div>;
    }
  };

  return (
    <div className={`ChatMessage-item ${isOwn ? "own" : "other"}`}>
      {renderContent()}
      <div className="ChatMessage-time">{time}</div>
    </div>
  );
};

export default MessageItem;
