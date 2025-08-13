import { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

import PersonalGreeting from "./components/PersonalGreeting.jsx";
import DailyVerse from "./components/DailyVerse.jsx";
import CopyButton from "./components/CopyButton.jsx";
import OfflineIndicator from "./components/OfflineIndicator.jsx";
import PWAInstallPrompt from "./components/PWAInstallPrompt.jsx";

import { getDailyVerse } from "./utils/verseSelector.js";
import { getCurrentDate } from "./utils/dateUtils.js";
import { useNetworkStatus } from "./hooks/useNetworkStatus.js";
import { localStorage as offlineStorage } from "./utils/offlineStorage.js";
import { performanceMonitor } from "./utils/performance.js";

// Import testing utilities in development
if (process.env.NODE_ENV === "development") {
  import("./utils/verseTestUtils.js");
}

function App() {
  const [currentVerse, setCurrentVerse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use network status hook
  const { isOnline, lastSync, connectionType } = useNetworkStatus();

  // Save verse to offline storage when it changes
  useEffect(() => {
    if (currentVerse) {
      const today = getCurrentDate();
      offlineStorage.saveLastVerseDate(today);
      console.log("App: Verse saved for offline access");
    }
  }, [currentVerse]);

  // Load daily verse
  useEffect(() => {
    const loadDailyVerse = () => {
      try {
        performanceMonitor.mark("verse-load-start");
        setIsLoading(true);
        const today = getCurrentDate();
        const verse = getDailyVerse(today);
        setCurrentVerse(verse);
        performanceMonitor.mark("verse-load-end");
        performanceMonitor.measure("verse-load-time", "verse-load-start", "verse-load-end");

        // Debug info for development
        if (process.env.NODE_ENV === "development") {
          console.log("📖 Daily Verse loaded:", {
            date: today.toDateString(),
            verse: `${verse.book} ${verse.chapter}:${verse.verse}`,
            category: verse.category,
            id: verse.id,
          });
        }
      } catch (error) {
        console.error("Error loading daily verse:", error);
        // Fallback verse will be handled by getDailyVerse
        const fallbackVerse = getDailyVerse();
        setCurrentVerse(fallbackVerse);
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyVerse();

    // Check for new verse at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      loadDailyVerse();

      // Set up daily interval after first midnight
      const dailyInterval = setInterval(loadDailyVerse, 24 * 60 * 60 * 1000);

      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  const handleCopySuccess = useCallback(() => {
    console.log("Verse copied successfully");
  }, []);

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="forest-background"></div>
        <div className="content-overlay">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-6">
                <div className="main-content">
                  <div className="text-center">
                    <div className="loading-spinner mb-3">
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Tunggu bentar yh yeyy💗💗💗...</span>
                      </div>
                    </div>
                    <p className="text-light">Memuat ayat harian untuk dedek wulan yeyy💗💗💗...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="forest-background"></div>
      <div className="content-overlay">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className="main-content">
                <PersonalGreeting name="dedek wulan cantikk💗💗💗" />

                <DailyVerse verse={currentVerse} onCopy={handleCopySuccess} />

                <CopyButton verse={currentVerse} onCopySuccess={handleCopySuccess} />

                <OfflineIndicator isOnline={isOnline} lastSync={lastSync} />

                <PWAInstallPrompt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
