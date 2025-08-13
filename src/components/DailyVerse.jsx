import { useState, useEffect, memo } from "react";
import { getVerseReference } from "../utils/verseSelector.js";

const DailyVerse = memo(function DailyVerse({ verse, onCopy }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation when verse loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [verse]);

  if (!verse) {
    return (
      <div className="daily-verse-container text-center">
        <div className="verse-loading">
          <p className="text-light">Memuat ayat harian buat dedek wulan yeyy💗💗💗...</p>
        </div>
      </div>
    );
  }

  const reference = getVerseReference(verse);

  return (
    <div className={`daily-verse-container ${isVisible ? "fade-in" : ""}`}>
      <div className="verse-card">
        <div className="verse-content text-center">
          <blockquote className="verse-text mb-4">
            <p className="text-light verse-quote">"{verse.text}"</p>
          </blockquote>

          <cite className="verse-reference d-block text-accent-gold">— {reference}</cite>

          {verse.category && (
            <div className="verse-category mt-3">
              <span className="badge bg-forest-light text-warm px-3 py-2">{verse.category}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default DailyVerse;
