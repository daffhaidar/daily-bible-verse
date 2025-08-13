// Offline storage utilities for Daily Bible Verse app

const STORAGE_KEYS = {
  VERSES: "daily-bible-verses",
  LAST_VERSE_DATE: "last-verse-date",
  USER_PREFERENCES: "user-preferences",
  SYNC_STATUS: "sync-status",
};

// Local Storage utilities
export const localStorage = {
  // Save verses to local storage
  saveVerses: (verses) => {
    try {
      const data = {
        verses,
        timestamp: new Date().toISOString(),
        version: "1.0",
      };
      window.localStorage.setItem(STORAGE_KEYS.VERSES, JSON.stringify(data));
      console.log("Storage: Verses saved to localStorage");
      return true;
    } catch (error) {
      console.error("Storage: Failed to save verses:", error);
      return false;
    }
  },

  // Load verses from local storage
  loadVerses: () => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.VERSES);
      if (!data) return null;

      const parsed = JSON.parse(data);
      console.log("Storage: Verses loaded from localStorage");
      return parsed.verses;
    } catch (error) {
      console.error("Storage: Failed to load verses:", error);
      return null;
    }
  },

  // Save last verse date
  saveLastVerseDate: (date) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.LAST_VERSE_DATE, date.toISOString());
      return true;
    } catch (error) {
      console.error("Storage: Failed to save last verse date:", error);
      return false;
    }
  },

  // Load last verse date
  loadLastVerseDate: () => {
    try {
      const dateStr = window.localStorage.getItem(STORAGE_KEYS.LAST_VERSE_DATE);
      return dateStr ? new Date(dateStr) : null;
    } catch (error) {
      console.error("Storage: Failed to load last verse date:", error);
      return null;
    }
  },

  // Save user preferences
  savePreferences: (preferences) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error("Storage: Failed to save preferences:", error);
      return false;
    }
  },

  // Load user preferences
  loadPreferences: () => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Storage: Failed to load preferences:", error);
      return {};
    }
  },

  // Clear all app data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        window.localStorage.removeItem(key);
      });
      console.log("Storage: All data cleared");
      return true;
    } catch (error) {
      console.error("Storage: Failed to clear data:", error);
      return false;
    }
  },
};

// IndexedDB utilities (for future enhancements)
export const indexedDB = {
  // Database configuration
  DB_NAME: "DailyBibleVerseDB",
  DB_VERSION: 1,
  STORES: {
    VERSES: "verses",
    HISTORY: "history",
    FAVORITES: "favorites",
  },

  // Initialize database
  init: () => {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB not supported"));
        return;
      }

      const request = window.indexedDB.open(indexedDB.DB_NAME, indexedDB.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create verses store
        if (!db.objectStoreNames.contains(indexedDB.STORES.VERSES)) {
          const versesStore = db.createObjectStore(indexedDB.STORES.VERSES, { keyPath: "id" });
          versesStore.createIndex("category", "category", { unique: false });
          versesStore.createIndex("book", "book", { unique: false });
        }

        // Create history store
        if (!db.objectStoreNames.contains(indexedDB.STORES.HISTORY)) {
          const historyStore = db.createObjectStore(indexedDB.STORES.HISTORY, { keyPath: "date" });
          historyStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        // Create favorites store (for future use)
        if (!db.objectStoreNames.contains(indexedDB.STORES.FAVORITES)) {
          db.createObjectStore(indexedDB.STORES.FAVORITES, { keyPath: "verseId" });
        }
      };
    });
  },

  // Save verse to history
  saveToHistory: async (verse, date) => {
    try {
      const db = await indexedDB.init();
      const transaction = db.transaction([indexedDB.STORES.HISTORY], "readwrite");
      const store = transaction.objectStore(indexedDB.STORES.HISTORY);

      const historyEntry = {
        date: date.toISOString().split("T")[0], // YYYY-MM-DD format
        verse,
        timestamp: new Date().toISOString(),
      };

      await store.put(historyEntry);
      console.log("Storage: Verse saved to history");
      return true;
    } catch (error) {
      console.error("Storage: Failed to save to history:", error);
      return false;
    }
  },

  // Get verse history
  getHistory: async (days = 7) => {
    try {
      const db = await indexedDB.init();
      const transaction = db.transaction([indexedDB.STORES.HISTORY], "readonly");
      const store = transaction.objectStore(indexedDB.STORES.HISTORY);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const request = store.getAll();
      const result = await new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Filter by date range
      const filtered = result.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= cutoffDate;
      });

      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error("Storage: Failed to get history:", error);
      return [];
    }
  },
};

// Storage quota management
export const storageQuota = {
  // Check available storage
  checkQuota: async () => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const available = quota - used;
        const usagePercentage = quota > 0 ? (used / quota) * 100 : 0;

        console.log(`Storage: Used ${(used / 1024 / 1024).toFixed(2)}MB of ${(quota / 1024 / 1024).toFixed(2)}MB (${usagePercentage.toFixed(1)}%)`);

        return {
          used,
          quota,
          available,
          usagePercentage,
        };
      } catch (error) {
        console.error("Storage: Failed to check quota:", error);
        return null;
      }
    }
    return null;
  },

  // Request persistent storage
  requestPersistent: async () => {
    if ("storage" in navigator && "persist" in navigator.storage) {
      try {
        const persistent = await navigator.storage.persist();
        console.log(`Storage: Persistent storage ${persistent ? "granted" : "denied"}`);
        return persistent;
      } catch (error) {
        console.error("Storage: Failed to request persistent storage:", error);
        return false;
      }
    }
    return false;
  },
};
