import React, { useEffect } from "react";
import "./css/ToastMsg.css";

const ToastMessage = ({ type, message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // 自動關閉
    }, duration);
    return () => clearTimeout(timer); // 清理定時器
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === "success" && "✅"}
        {type === "error" && "❌"}
        {type === "warning" && "⚠️"}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default ToastMessage;
