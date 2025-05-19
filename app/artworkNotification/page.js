'use client'

import React, { useRef } from "react";
import { notoSansTCClass } from '@/app/layout.js';
import NotificationList from "@/components/ArtworkNotification/ArtworkNotificationList.jsx";
import "@/app/artworkNotification/artworkNotification.css";

function ArtworkNotificationPage() {
  const personalListRef = useRef();
  const systemListRef = useRef();

  const handleMarkAllAsRead = () => {
    personalListRef.current?.markAllAsRead();
    systemListRef.current?.markAllAsRead();
  };

  return (
    <div className={`artworkNotification-page ${notoSansTCClass}`}>
      {/* 個人通知區塊 */}
      <div className="artworkNotification-offset" />
      <section className="artworkNotification-section">
        <div className="artworkNotification-headerRow">
          <h2 className="artworkNotification-title">個人通知</h2>
          <button
            className="artworkNotification-markAllReadBtn"
            onClick={handleMarkAllAsRead}
          >
            一鍵已讀
          </button>
        </div>
        <div className="artworkNotification-container">
          <NotificationList ref={personalListRef} type="personal" />
        </div>
      </section>

      {/* 系統通知區塊 */}
      <section className="artworkNotification-section">
        <h2 className="artworkNotification-title">系統通知</h2>
        <div className="artworkNotification-container">
          <NotificationList ref={systemListRef} type="system" />
        </div>
      </section>
      <div className="artworkNotification-offset" />
    </div>
  );
}

export default ArtworkNotificationPage;
