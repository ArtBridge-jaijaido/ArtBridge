import { useEffect, useState } from "react";
import NotificationItem from "@/components/ArtworkNotification/ArtworkNotificationItem.jsx";

function MixedNotificationList({ limit = 10 }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchMixed = () => {
      // 模擬 5 條個人通知 + 5 條系統通知 + 混合 + 排序
      const personal = Array.from({ length: 5 }).map((_, idx) => ({
        id: `p-${idx}`,
        title: "【個人通知】",
        content: `您追蹤的用戶發佈了第 ${idx + 1} 則貼文`,
        type: "personal",
        read: false,
        timestamp: Date.now() - idx * 1000 * 60,
      }));

      const system = Array.from({ length: 5 }).map((_, idx) => ({
        id: `s-${idx}`,
        title: "【系統通知】",
        content: `系統於 ${idx + 1} 分鐘前進行了更新`,
        type: "system",
        read: false,
        timestamp: Date.now() - idx * 1000 * 90,
      }));

      const mixed = [...personal, ...system]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);

      setNotifications(mixed);
    };

    fetchMixed();
  }, [limit]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="ArtworkNotificationList-list">
      {notifications.map((n) => (
        <NotificationItem key={n.id} data={n} onClick={() => markAsRead(n.id)} />
      ))}
    </div>
  );
}

export default MixedNotificationList;
