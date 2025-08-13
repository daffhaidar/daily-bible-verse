import { useState, memo, useCallback } from "react";
import { formatVerseForCopy } from "../utils/verseSelector.js";

const CopyButton = memo(function CopyButton({ verse, onCopySuccess }) {
  const [copyStatus, setCopyStatus] = useState("idle"); // idle, copying, success, error

  const handleCopy = useCallback(async () => {
    if (!verse || copyStatus === "copying") return;

    setCopyStatus("copying");

    try {
      const textToCopy = formatVerseForCopy(verse);

      if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Fallback copy failed");
        }
      }

      setCopyStatus("success");
      if (onCopySuccess) {
        onCopySuccess();
      }

      // Reset status after 2 seconds
      setTimeout(() => {
        setCopyStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      setCopyStatus("error");

      // Reset status after 3 seconds
      setTimeout(() => {
        setCopyStatus("idle");
      }, 3000);
    }
  }, [verse, copyStatus, onCopySuccess]);

  const getButtonText = () => {
    switch (copyStatus) {
      case "copying":
        return "Menyalin...";
      case "success":
        return "Tersalin! ✓";
      case "error":
        return "Gagal menyalin";
      default:
        return "Salin Ayat";
    }
  };

  const getButtonClass = () => {
    const baseClass = "btn copy-button px-4 py-2";
    switch (copyStatus) {
      case "success":
        return `${baseClass} btn-success`;
      case "error":
        return `${baseClass} btn-danger`;
      case "copying":
        return `${baseClass} btn-secondary`;
      default:
        return `${baseClass} btn-outline-light`;
    }
  };

  return (
    <div className="copy-button-container text-center mt-4">
      <button className={getButtonClass()} onClick={handleCopy} disabled={copyStatus === "copying" || !verse} title="Salin ayat ke clipboard adekk yey💗💗💗">
        {getButtonText()}
      </button>

      {copyStatus === "error" && (
        <div className="copy-error-message mt-2">
          <small className="text-light opacity-75">Tidak dapat menyalin otomatis hiksss. Silakan salin manual noooooo.</small>
        </div>
      )}
    </div>
  );
});

export default CopyButton;
