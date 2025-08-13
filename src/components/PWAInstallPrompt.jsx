import { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall.js";

export default function PWAInstallPrompt() {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installPWA();
      if (success) {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Installation failed:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember user dismissed the prompt (could use localStorage)
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  // Don't show if already installed or not installable
  if (isInstalled || !isInstallable || !showPrompt) {
    return null;
  }

  // Check if user previously dismissed
  if (localStorage.getItem("pwa-install-dismissed") === "true") {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="install-prompt-content">
        <div className="install-icon">📱</div>
        <div className="install-text">
          <h6 className="text-light mb-1">Tambah ke Home Screen adekk kicik</h6>
          <p className="text-light opacity-75 mb-0 small">Install untuk akses cepat ayat harian dedek wulann yeyy💗💗💗</p>
        </div>
        <div className="install-actions">
          <button className="btn btn-sm btn-outline-light me-2" onClick={handleInstall} disabled={isInstalling}>
            {isInstalling ? "Installing..." : "Install"}
          </button>
          <button className="btn btn-sm btn-link text-light opacity-75" onClick={handleDismiss}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
