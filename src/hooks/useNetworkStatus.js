import { useState, useEffect } from "react";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());
  const [connectionType, setConnectionType] = useState("unknown");

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (online) {
        setLastSync(new Date());
        console.log("Network: Back online, syncing data...");

        // Trigger background sync if service worker is available
        if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready
            .then((registration) => {
              return registration.sync.register("verse-sync");
            })
            .catch((error) => {
              console.error("Network: Background sync registration failed:", error);
            });
        }
      } else {
        console.log("Network: Gone offline, using cached data...");
      }
    };

    const updateConnectionType = () => {
      if ("connection" in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          setConnectionType(connection.effectiveType || connection.type || "unknown");
        }
      }
    };

    // Initial setup
    updateOnlineStatus();
    updateConnectionType();

    // Event listeners
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Connection change listener (if supported)
    if ("connection" in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        connection.addEventListener("change", updateConnectionType);
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);

      if ("connection" in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          connection.removeEventListener("change", updateConnectionType);
        }
      }
    };
  }, []);

  // Periodic connectivity check
  useEffect(() => {
    const checkConnectivity = async () => {
      if (!isOnline) return;

      try {
        // Try to fetch a small resource to verify actual connectivity
        const response = await fetch("/manifest.json", {
          method: "HEAD",
          cache: "no-cache",
        });

        if (response.ok) {
          setLastSync(new Date());
        }
      } catch (error) {
        console.warn("Network: Connectivity check failed:", error);
        // Don't change online status based on this check
        // as it might be a temporary network issue
      }
    };

    // Check connectivity every 5 minutes when online
    const interval = setInterval(checkConnectivity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isOnline]);

  return {
    isOnline,
    lastSync,
    connectionType,
  };
};
