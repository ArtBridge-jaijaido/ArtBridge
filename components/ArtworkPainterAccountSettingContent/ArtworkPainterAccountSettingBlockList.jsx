"use client";
import React from 'react'
import "./ArtworkPainterAccountSettingBlockList.css";

const ArtworkPainterAccountSettingBlockList = ({ blockedUsers, onUnblock, onReport }) => {
  return (
    <div className="artworkPainterAccountSettingBlockList-container">
      
      {blockedUsers.length === 0 ? (
        <p className="ArtworkPainterAccountSettingBlockList-empty">目前沒有封鎖的使用者</p>
      ) : (
        blockedUsers.map((user) => (
          <div key={user.id} className="ArtworkPainterAccountSettingBlockList-item">
            {/* 使用者大頭貼 */}
            <div className="ArtworkPainterAccountSettingBlockList-avatar">
              <img src={user.profileAvatar || "/images/kv-min-4.png"} alt="使用者頭像" />
            </div>

            {/* 使用者資訊 */}
            <div className="ArtworkPainterAccountSettingBlockList-info">
              <div className="ArtworkPainterAccountSettingBlockList-username">{user.username}</div>
              <div className="ArtworkPainterAccountSettingBlockList-userID">{user.userID}</div>
            </div>

            {/* 按鈕區域 */}
            <div className="ArtworkPainterAccountSettingBlockList-actions">
              <button className="ArtworkPainterAccountSettingBlockList-unblock" onClick={() => onUnblock(user.id)}>
                解除
              </button>
              <button className="ArtworkPainterAccountSettingBlockList-report" onClick={() => onReport(user.id)}>
                檢舉
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ArtworkPainterAccountSettingBlockList;