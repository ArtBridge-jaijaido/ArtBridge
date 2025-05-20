'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import NotificationItem from "@/components/ArtworkNotification/ArtworkNotificationItem.jsx";
import "@/components/ArtworkNotification/ArtworkNotificationList.css";

const NotificationList = forwardRef(function NotificationList({ type }, ref) {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [readAll, setReadAll] = useState(false); // ✅ 新增：記錄是否一鍵已讀

  useEffect(() => {
    loadNotifications(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadNotifications = async (pageNum) => {
    const fetched = Array.from({ length: 10 }).map((_, idx) => ({
       id: `${type}-${crypto.randomUUID()}`, // temporary unique ID
      title: type === "personal" ? "【個人通知】" : "【系統通知】",
      content: `這是第 ${pageNum * 10 + idx + 1} 條通知內容`,
      read: readAll, // ✅ 若一鍵已讀過，新通知預設也為已讀
    }));

    setNotifications((prev) => [...prev, ...fetched]);
    if (fetched.length < 10) setHasMore(false);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setReadAll(true); // ✅ 讓之後的通知預設為已讀
  };

  useImperativeHandle(ref, () => ({
    markAllAsRead,
  }));

  return (
    <div className="ArtworkNotificationList-list">
      {notifications.map((n) => (
        <NotificationItem key={n.id} data={n} onClick={() => markAsRead(n.id)} />
      ))}
      {hasMore && (
        <button className="ArtworkNotificationList-loadMoreBtn" onClick={handleLoadMore}>
          載入更多
        </button>
      )}
    </div>
  );
});

export default NotificationList;
