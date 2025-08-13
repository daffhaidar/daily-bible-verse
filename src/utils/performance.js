// Performance utilities for Daily Bible Verse app

// Debounce function for performance optimization
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization utility
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map();

  return (...args) => {
    const key = getKey(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  };
};

// Lazy loading utility for images
export const lazyLoadImage = (src, placeholder = null) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(src);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };

    // Start loading
    img.src = src;
  });
};

// Performance monitoring
export const performanceMonitor = {
  // Mark performance timing
  mark: (name) => {
    if ("performance" in window && "mark" in performance) {
      performance.mark(name);
    }
  },

  // Measure performance between marks
  measure: (name, startMark, endMark) => {
    if ("performance" in window && "measure" in performance) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        console.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
      } catch (error) {
        console.warn("Performance measurement failed:", error);
        return null;
      }
    }
    return null;
  },

  // Get navigation timing
  getNavigationTiming: () => {
    if ("performance" in window && "navigation" in performance) {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        firstPaint: performance.getEntriesByType("paint").find((entry) => entry.name === "first-paint")?.startTime || null,
        firstContentfulPaint: performance.getEntriesByType("paint").find((entry) => entry.name === "first-contentful-paint")?.startTime || null,
      };
    }
    return null;
  },

  // Log performance metrics
  logMetrics: () => {
    const metrics = performanceMonitor.getNavigationTiming();
    if (metrics) {
      console.log("Performance Metrics:", metrics);
    }
  },
};

// Bundle size optimization - dynamic imports
export const dynamicImport = {
  // Lazy load components
  loadComponent: async (importFn) => {
    try {
      const module = await importFn();
      return module.default || module;
    } catch (error) {
      console.error("Dynamic import failed:", error);
      throw error;
    }
  },

  // Preload modules
  preloadModule: (importFn) => {
    // Start loading but don't wait for it
    importFn().catch((error) => {
      console.warn("Module preload failed:", error);
    });
  },
};

// Memory usage monitoring
export const memoryMonitor = {
  // Get memory usage (if available)
  getUsage: () => {
    if ("memory" in performance) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        usagePercentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  },

  // Log memory usage
  logUsage: () => {
    const usage = memoryMonitor.getUsage();
    if (usage) {
      console.log(`Memory: ${(usage.used / 1024 / 1024).toFixed(2)}MB used of ${(usage.limit / 1024 / 1024).toFixed(2)}MB limit (${usage.usagePercentage.toFixed(1)}%)`);
    }
  },

  // Monitor memory leaks
  startMonitoring: (interval = 30000) => {
    return setInterval(() => {
      const usage = memoryMonitor.getUsage();
      if (usage && usage.usagePercentage > 80) {
        console.warn("High memory usage detected:", usage);
      }
    }, interval);
  },
};

// Resource hints for better loading
export const resourceHints = {
  // Preload critical resources
  preload: (href, as, type = null) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  },

  // Prefetch resources for future navigation
  prefetch: (href) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  },

  // Preconnect to external domains
  preconnect: (href, crossorigin = false) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    if (crossorigin) link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  },
};
