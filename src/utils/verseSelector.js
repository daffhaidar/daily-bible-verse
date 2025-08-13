// Verse selection logic for Daily Bible Verse app
import { completeBibleVerses } from "../data/bibleVerses.js";
import { getDateSeed } from "./dateUtils.js";
import { memoize } from "./performance.js";

// Memoized version of getDailyVerse for performance
const getDailyVerseInternal = (date = new Date()) => {
  // Fallback verse if no verses available
  const fallbackVerse = {
    id: 0,
    text: "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.",
    book: "Yohanes",
    chapter: 3,
    verse: 16,
    category: "love",
  };

  if (!completeBibleVerses || completeBibleVerses.length === 0) {
    return fallbackVerse;
  }

  try {
    // Advanced algorithm for better randomization across the year
    const year = date.getFullYear();
    const dayOfYear = getDayOfYear(date);

    // Create a more complex seed using multiple factors
    const baseSeed = year * 1000 + dayOfYear;
    const complexSeed = (baseSeed * 31 + dayOfYear * 17 + year * 7) % 982451653; // Large prime

    // Use Linear Congruential Generator for better distribution
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    const randomValue = (a * complexSeed + c) % m;

    // Map to verse index with better distribution
    const index = Math.abs(randomValue) % completeBibleVerses.length;

    console.log(`Daily Verse: Day ${dayOfYear} of ${year} -> Verse ${index + 1}/${completeBibleVerses.length}`);

    return completeBibleVerses[index];
  } catch (error) {
    console.error("Error selecting daily verse:", error);
    return fallbackVerse;
  }
};

// Export memoized version for better performance
export const getDailyVerse = memoize(getDailyVerseInternal, (date) => {
  // Use date string as cache key
  return date.toDateString();
});

export const getVerseReference = (verse) => {
  if (!verse || !verse.book || !verse.chapter || !verse.verse) {
    return "";
  }

  return `${verse.book} ${verse.chapter}:${verse.verse}`;
};

export const formatVerseForCopy = (verse) => {
  if (!verse) return "";

  const reference = getVerseReference(verse);
  return `"${verse.text}"\n\n— ${reference}`;
};
// Helper function to get day of year (1-365/366)
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Function to get verse by specific day of year (for testing)
export const getVerseByDayOfYear = (dayOfYear, year = new Date().getFullYear()) => {
  const date = new Date(year, 0, dayOfYear);
  return getDailyVerseInternal(date);
};

// Function to preview next few days' verses
export const previewUpcomingVerses = (days = 7) => {
  const today = new Date();
  const upcoming = [];

  for (let i = 0; i < days; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    const verse = getDailyVerseInternal(futureDate);

    upcoming.push({
      date: futureDate.toDateString(),
      dayOfYear: getDayOfYear(futureDate),
      verse: {
        id: verse.id,
        text: verse.text.substring(0, 100) + (verse.text.length > 100 ? "..." : ""),
        reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
        category: verse.category,
      },
    });
  }

  return upcoming;
};

// Function to check verse distribution (for testing)
export const analyzeVerseDistribution = (days = 365) => {
  const today = new Date();
  const usedVerses = new Set();
  const categoryCount = {};

  for (let i = 0; i < days; i++) {
    const testDate = new Date(today);
    testDate.setDate(today.getDate() + i);
    const verse = getDailyVerseInternal(testDate);

    usedVerses.add(verse.id);
    categoryCount[verse.category] = (categoryCount[verse.category] || 0) + 1;
  }

  return {
    totalVerses: completeBibleVerses.length,
    usedVerses: usedVerses.size,
    coverage: ((usedVerses.size / completeBibleVerses.length) * 100).toFixed(1) + "%",
    categoryDistribution: categoryCount,
    duplicates: days - usedVerses.size,
  };
};
