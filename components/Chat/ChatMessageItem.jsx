"use client";
import React from "react";
import "./ChatMessageItem.css";

const MessageItem = ({ message, isOwn }) => {
  const { type = "text", text, payload, createdAt } = message;

  console.log(message);

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

      case "system-painterConfirmOrder":
        if (payload?.dateToStart && payload?.payDeadline) {
          const deadline = new Date(payload.payDeadline);

          // 格式化日期
          const formattedStart = payload.dateToStart;
          const formattedDeadline = `${deadline.getFullYear()}/${String(
            deadline.getMonth() + 1
          ).padStart(2, "0")}/${String(deadline.getDate()).padStart(
            2,
            "0"
          )}，${String(deadline.getHours()).padStart(2, "0")}:${String(
            deadline.getMinutes()
          ).padStart(2, "0")}`;

          return (
            <div className="ChatMessage-systemBox">
              <div className="ChatMessage-system-painterConfirmOrder-title">繪師已選擇開始時間</div>
              <div className="ChatMessage-system-painterConfirmOrder-start">
                案件開始時間：{formattedStart}
              </div>
              <div className="ChatMessage-system-painterConfirmOrder-deadline">
                請於 <span>{formattedDeadline}</span> 前付款
              </div>
            </div>
          );
        }

      case "milestoneNotice":
        return <div className="ChatMessage-milestone-notice"></div>;

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
