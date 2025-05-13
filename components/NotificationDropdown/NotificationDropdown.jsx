import { useEffect, useRef } from "react";
import MixedNotificationList from "@/components/NotificationDropdown/MixedNotificationList";
import "@/components/NotificationDropdown/NotificationDropdown.css";

function NotificationDropdown({ onClose }) {
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="NotificationDropdown-container" ref={dropdownRef}>
      <div className="NotificationDropdown-header">通知中心</div>
      <div className="NotificationDropdown-list">
        <MixedNotificationList limit={10} />
      </div>
      <div className="NotificationDropdown-footer">
        <a href="/artworkNotification">查看全部通知</a>
      </div>
    </div>
  );
}

export default NotificationDropdown;
