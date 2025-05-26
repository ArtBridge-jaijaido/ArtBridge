'use client'

import { forwardRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";
import NotificationItem from "@/components/ArtworkNotification/ArtworkNotificationItem.jsx";
import "@/components/ArtworkNotification/ArtworkNotificationList.css";
import {
  markNotificationAsRead,
  markNotificationsAsReadBulk,
} from "@/services/notificationService"; // 使用 service 集中邏輯

import {
  updateNotification,
  markAllAsRead as markAllAsReadRedux,
} from "@/app/redux/feature/notificationSlice";

const NotificationList = forwardRef(function NotificationList({ type }, ref) {
  const dispatch = useDispatch();
  const notifications = useSelector((state) =>
    state.notifications.items.filter((n) => n.type === type)
  );

  // 點擊單一通知
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      const target = notifications.find((n) => n.id === id);
      if (target) {
        dispatch(updateNotification({ ...target, isRead: true }));
      }
    } catch (error) {
      console.error(" 更新已讀失敗：", error);
    }
  };

  // 一鍵標記為已讀
  const markAllAsRead = async () => {
    try {
      const ids = notifications.map((n) => n.id);
      await markNotificationsAsReadBulk(ids);
      dispatch(markAllAsReadRedux());
    } catch (error) {
      console.error(" 一鍵已讀失敗：", error);
    }
  };

  // 給父層 ArtworkNotificationPage 呼叫
  useImperativeHandle(ref, () => ({
    markAllAsRead,
  }));

  return (
    <div className="ArtworkNotificationList-list">
      {notifications.length === 0 ? (
        <div className="ArtworkNotificationList-empty">目前尚無通知</div>
      ) : (
        notifications.map((n) => (
          <NotificationItem
            key={n.id}
            data={n}
            onClick={() => handleMarkAsRead(n.id)}
          />
        ))
      )}
    </div>
  );
});

export default NotificationList;
