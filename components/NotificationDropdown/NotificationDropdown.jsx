// NotificationDropdown.jsx
'use client';

import React from 'react';
import NotificationItem from '@/components/ArtworkNotification/ArtworkNotificationItem.jsx';
import './NotificationDropdown.css';

function NotificationDropdown({ notifications, markAsRead }) {
  return (
    <div className="notificationDropdown-panel">
      <div className="ArtworkNotificationList-list">
        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            data={n}
            onClick={() => markAsRead(n.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationDropdown;
