import { useState, useEffect } from "react";

export default function OfflineIndicator({ isOnline, lastSync }) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Show indicator when offline or when connection status changes
    if (!isOnline) {
      setShowIndicator(true);
    } else {
      // Hide indicator after a brief moment when back online
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const formatLastSync = (date) => {
    if (!date) return "Tidak diketahui";

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  if (!showIndicator && isOnline) {
    return null;
  }

  return (
    <div className={`offline-indicator ${isOnline ? "online" : "offline"}`}>
      <div className="indicator-content">
        <div className="status-icon">{isOnline ? <span className="text-success">🟢</span> : <span className="text-warning">🟡</span>}</div>

        <div className="status-text">
          <small className="text-light">
            {isOnline ? (
              <>
                <strong>Online</strong>
                {lastSync && (
                  <span className="opacity-75">
                    {" • Sinkronisasi: "}
                    {formatLastSync(lastSync)}
                  </span>
                )}
              </>
            ) : (
              <>
                <strong>Mode Offline</strong>
                <span className="opacity-75">{" • Ayat tersedia tanpa internet"}</span>
              </>
            )}
          </small>
        </div>
      </div>
    </div>
  );
}
