import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Trash2,
  UserPlus,
  ShoppingCart,
  DollarSign,
  CheckSquare,
  StickyNote,
} from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return MessageCircle;
    case "event":
      return Calendar;
    case "task":
      return CheckSquare;
    case "grocery":
      return ShoppingCart;
    case "bill":
      return DollarSign;
    case "note":
      return StickyNote;
    case "member":
      return UserPlus;
    case "delete":
      return Trash2;
    default:
      return MessageCircle;
  }
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return time.toLocaleDateString();
};

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, clearAllNotifications } = useHouseMate();

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div
          className="p-6 pb-4"
          style={{ backgroundColor: "#d4e3d0" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: "#7a9b6f" }}>Notifications</h2>
            <button
              onClick={handleClearAll}
              className="text-text"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div
          className="flex-1 p-6 overflow-y-auto space-y-3"
          style={{ backgroundColor: "#f0f7ed" }}
        >
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-light">
                No notifications
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = getNotificationIcon(notif.type);
              return (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id)}
                  className={`w-full rounded-2xl p-4 flex items-start gap-3 text-left transition-all duration-200 active:scale-98 ${
                    !notif.isRead ? "border-2" : ""
                  }`}
                  style={{
                    backgroundColor: "#d4e3d0",
                    borderColor: !notif.isRead
                      ? "#7a9b6f"
                      : "transparent",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative text-white"
                    style={{ backgroundColor: "#7a9b6f" }}
                  >
                    <Icon className="w-6 h-6" />
                    {!notif.isRead && (
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-surface"
                        style={{ backgroundColor: "#e88560" }}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-text text-sm font-medium">
                        {notif.title}
                      </h3>
                      <span className="text-text-light whitespace-nowrap ml-2 text-xs">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>

                    <p className="text-text-light">
                      {notif.message}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}