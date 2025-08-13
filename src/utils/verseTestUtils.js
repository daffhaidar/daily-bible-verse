// Testing utilities for verse selection algorithm
import { analyzeVerseDistribution, previewUpcomingVerses, getVerseByDayOfYear } from "./verseSelector.js";
import { completeBibleVerses } from "../data/bibleVerses.js";

// Test functions for console debugging
export const testVerseAlgorithm = () => {
  console.log("🧪 Testing Daily Bible Verse Algorithm...\n");

  // Basic info
  console.log(`📚 Total verses available: ${completeBibleVerses.length}`);

  // Test distribution over a year
  const analysis = analyzeVerseDistribution(365);
  console.log("\n📊 Year-long Analysis (365 days):");
  console.log(`- Unique verses used: ${analysis.usedVerses}/${analysis.totalVerses}`);
  console.log(`- Coverage: ${analysis.coverage}`);
  console.log(`- Duplicates: ${analysis.duplicates}`);
  console.log("- Category distribution:", analysis.categoryDistribution);

  // Preview next week
  console.log("\n📅 Next 7 days preview:");
  const upcoming = previewUpcomingVerses(7);
  upcoming.forEach((day, index) => {
    console.log(`Day ${index + 1} (${day.date}): ${day.verse.reference} - "${day.verse.text}" [${day.verse.category}]`);
  });

  // Test specific days
  console.log("\n🎯 Testing specific days:");
  const testDays = [1, 100, 200, 300, 365];
  testDays.forEach((day) => {
    const verse = getVerseByDayOfYear(day);
    console.log(`Day ${day}: ${verse.book} ${verse.chapter}:${verse.verse} - ${verse.category}`);
  });

  console.log("\n✅ Algorithm test complete!");
  return analysis;
};

// Quick test for current day
export const testTodayVerse = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const verse = getVerseByDayOfYear(dayOfYear);

  console.log("📖 Today's verse test:");
  console.log(`Date: ${today.toDateString()}`);
  console.log(`Day of year: ${dayOfYear}`);
  console.log(`Verse: ${verse.book} ${verse.chapter}:${verse.verse}`);
  console.log(`Text: "${verse.text}"`);
  console.log(`Category: ${verse.category}`);

  return verse;
};

// Test for dedek wulan's birthday or special dates
export const testSpecialDates = () => {
  console.log("🎂 Testing special dates for dedek wulan yey💗💗💗...");

  // Test some special dates (you can customize these)
  const specialDates = [
    { name: "New Year", month: 0, day: 1 },
    { name: "Valentine's Day", month: 1, day: 14 },
    { name: "Easter (approx)", month: 3, day: 15 },
    { name: "Christmas", month: 11, day: 25 },
    { name: "New Year's Eve", month: 11, day: 31 },
  ];

  const currentYear = new Date().getFullYear();

  specialDates.forEach((special) => {
    const date = new Date(currentYear, special.month, special.day);
    const dayOfYear = Math.floor((date - new Date(currentYear, 0, 0)) / (1000 * 60 * 60 * 24));
    const verse = getVerseByDayOfYear(dayOfYear);

    console.log(`${special.name} (Day ${dayOfYear}): ${verse.book} ${verse.chapter}:${verse.verse} - "${verse.text.substring(0, 80)}..." [${verse.category}]`);
  });
};

// Make functions available globally for console testing
if (typeof window !== "undefined") {
  window.testVerseAlgorithm = testVerseAlgorithm;
  window.testTodayVerse = testTodayVerse;
  window.testSpecialDates = testSpecialDates;

  console.log("🔧 Verse testing utilities loaded! Try:");
  console.log("- testVerseAlgorithm() - Full algorithm analysis");
  console.log("- testTodayVerse() - Test today's verse");
  console.log("- testSpecialDates() - Test special dates");
}
