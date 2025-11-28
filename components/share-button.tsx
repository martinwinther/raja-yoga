"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { shareContent } from "../lib/sharing";

interface ShareButtonProps {
  content: string;
  title?: string;
  className?: string;
  variant?: "primary" | "ghost";
}

export function ShareButton({
  content,
  title,
  className = "",
  variant = "ghost",
}: ShareButtonProps) {
  const [shared, setShared] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const success = await shareContent(content, title);
      if (success) {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (error) {
      console.warn("[ShareButton] Share failed:", error);
    } finally {
      setSharing(false);
    }
  };

  const baseClasses =
    variant === "primary"
      ? "btn-primary"
      : "btn-ghost";

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={sharing}
      className={`${baseClasses} ${className}`}
      aria-label={shared ? "Content copied to clipboard" : sharing ? "Sharing content" : `Share ${title || "content"}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {shared ? (
        <>
          <Check className="h-4 w-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>{sharing ? "Sharing..." : "Share"}</span>
        </>
      )}
    </button>
  );
}

