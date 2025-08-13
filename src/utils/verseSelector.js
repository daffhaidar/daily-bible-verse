// Verse selection logic for Daily Bible Verse app
import { bibleVerses } from "../data/bibleVerses.js";
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

  if (!bibleVerses || bibleVerses.length === 0) {
    return fallbackVerse;
  }

  try {
    // Use date as seed for consistent daily selection
    const seed = getDateSeed(date);
    const index = seed % bibleVerses.length;

    return bibleVerses[index];
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
