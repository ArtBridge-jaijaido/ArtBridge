import "@/components/ArtworkNotification/ArtworkNotificationItem.css";

function NotificationItem({ data, onClick }) {
  return (
    <div
      className={`ArtworkNotificationItem-item ${data.read ? "read" : "unread"}`}
      onClick={onClick}
    >
      <div className="ArtworkNotificationItem-content">
        <div className="ArtworkNotificationItem-title">
          <span
            className="ArtworkNotificationItem-redDot"
            style={{ visibility: data.read ? "hidden" : "visible" }}
          />
          {data.title}
        </div>
        <div className="ArtworkNotificationItem-text">{data.content}</div>
      </div>
    </div>
  );  
}

export default NotificationItem;
