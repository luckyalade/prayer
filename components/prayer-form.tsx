"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { InfoModal } from "./info-modal";
import { motion } from "framer-motion";

// Detect iOS devices
const isIOS = () => {
  if (typeof window === "undefined") return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

// Simple encryption function to store prayer with code
function encryptPrayer(prayer: string): string {
  // Convert prayer to base64 and store with timestamp for January 1st, 2027 access
  const data = {
    prayer,
    accessDate: "2027-01-01T00:00:00.000Z",
    createdAt: new Date().toISOString(),
  };
  return btoa(JSON.stringify(data));
}

// Decrypt prayer from stored data
function decryptPrayer(
  encrypted: string
): { prayer: string; accessDate: string; createdAt: string } | null {
  try {
    const json = atob(encrypted);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Check if access date has passed (January 1st, 2027)
function canAccessPrayer(): boolean {
  const accessDate = new Date("2027-01-01T00:00:00.000Z");
  const now = new Date();
  return now >= accessDate;
}

// Generate a unique 10-digit access code
function generateAccessCode(): string {
  // Get current timestamp and random component
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return timestamp + random;
}

type Mode = "initial" | "submit" | "submitted" | "retrieve" | "retrieved";

interface PrayerFormProps {
  onModeChange?: (mode: Mode) => void;
}

export function PrayerForm({ onModeChange }: PrayerFormProps = {}) {
  const [mode, setMode] = useState<Mode>("initial");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [prayerText, setPrayerText] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [retrieveCode, setRetrieveCode] = useState("");
  const [retrievedPrayer, setRetrievedPrayer] = useState("");
  const [error, setError] = useState("");
  const [savedScrollPosition, setSavedScrollPosition] = useState("24px");

  const handleSubmit = () => {
    if (!prayerText.trim()) return;

    // Generate unique 10-digit access code
    const code = generateAccessCode();
    setAccessCode(code);

    // Encrypt and store the prayer
    const encryptedPrayer = encryptPrayer(prayerText);

    // Store in localStorage with the code as key
    localStorage.setItem(`prayer_${code}`, encryptedPrayer);

    // Dismiss the keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // iOS needs extra time for keyboard dismissal and viewport stabilization
    const delay = isIOS() ? 400 : 0;

    setTimeout(() => {
      // Scroll to top after keyboard is dismissed
      window.scrollTo({ top: 0, behavior: "instant" });

      requestAnimationFrame(() => {
        const newMode = "submitted";
        setMode(newMode);
        onModeChange?.(newMode);
      });
    }, delay);
  };

  const handleRetrieve = () => {
    setError("");

    // Validate code format (10 digits)
    if (!/^\d{10}$/.test(retrieveCode)) {
      setError("please enter a valid 10-digit code.");
      return;
    }

    // Try to retrieve from localStorage first
    const encrypted = localStorage.getItem(`prayer_${retrieveCode}`);
    if (!encrypted) {
      setError("no prayer found with this code.");
      return;
    }

    // Check if access date has passed
    if (!canAccessPrayer()) {
      setError("your prayer will be available on January 1st, 2027.");
      return;
    }

    const decrypted = decryptPrayer(encrypted);
    if (!decrypted) {
      setError("could not decrypt your prayer.");
      return;
    }

    setRetrievedPrayer(decrypted.prayer);

    // Dismiss the keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // iOS needs extra time for keyboard dismissal and viewport stabilization
    const delay = isIOS() ? 400 : 0;

    setTimeout(() => {
      // Scroll to top after keyboard is dismissed
      window.scrollTo({ top: 0, behavior: "instant" });

      requestAnimationFrame(() => {
        const newMode = "retrieved";
        setMode(newMode);
        onModeChange?.(newMode);
      });
    }, delay);
  };

  const copyToClipboard = async () => {
    try {
      // Try the modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(accessCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for mobile browsers
        const textArea = document.createElement("textarea");
        textArea.value = accessCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        } catch (err) {
          console.error("Fallback: Failed to copy:", err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      // Try fallback even if modern API threw an error
      const textArea = document.createElement("textarea");
      textArea.value = accessCode;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (fallbackErr) {
        console.error("Fallback: Failed to copy:", fallbackErr);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  // Initial state - show Enter button
  if (mode === "initial") {
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            const newMode = "submit";
            setMode(newMode);
            onModeChange?.(newMode);
          }}
          className="mt-2 rounded-full px-6 py-2 text-black text-2xl lowercase cursor-pointer transition-colors"
        >
          Enter
        </button>
        <button
          onClick={() => {
            const newMode = "retrieve";
            setMode(newMode);
            onModeChange?.(newMode);
          }}
          className="mt-4 text-black text-md lowercase hover:text-black transition-colors cursor-pointer"
        >
          Have a code? Access your prayer
        </button>
      </div>
    );
  }

  // Retrieve mode - enter code to access prayer
  if (mode === "retrieve") {
    return (
      <motion.div
        className="flex flex-col items-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-black text-lg mb-6">enter your 10-digit code</p>
        <input
          type="text"
          value={retrieveCode}
          onChange={(e) => {
            // Only allow digits and max 10 characters
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setRetrieveCode(value);
            setError("");
          }}
          onFocus={() => {
            // Save current scroll position before keyboard appears
            if (isIOS()) {
              setSavedScrollPosition(window.scrollY || window.pageYOffset);
            }
          }}
          onBlur={() => {
            // Restore scroll position after keyboard dismisses on iOS
            if (isIOS()) {
              // Give time for keyboard to fully dismiss
              setTimeout(() => {
                window.scrollTo({
                  top: savedScrollPosition,
                  behavior: "smooth",
                });
              }, 300);
            }
          }}
          placeholder="0000000000"
          className="w-[300px] border border-black rounded-full py-3 px-6 text-center text-black text-lg tracking-wider bg-transparent focus:outline-none focus:ring-1 focus:ring-black/20"
          maxLength={10}
        />
        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleRetrieve}
          disabled={retrieveCode.length !== 10}
          className="mt-4 text-black text-lg lowercase hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          access prayer
        </button>
        <button
          onClick={() => {
            const newMode = "initial";
            setMode(newMode);
            onModeChange?.(newMode);
            setRetrieveCode("");
            setError("");
          }}
          className="cursor-pointer mt-4 text-black text-sm lowercase hover:text-black transition-colors"
        >
          go back
        </button>
      </motion.div>
    );
  }

  // Retrieved mode - show the prayer
  if (mode === "retrieved") {
    return (
      <div className="flex flex-col items-center animate-in fade-in duration-500 mt-8">
        <p className="text-black text-lg mb-4">your 2026 prayer:</p>
        <div className="w-[300px] border border-black rounded-[20px] p-4 text-black text-base whitespace-pre-wrap">
          {retrievedPrayer}
        </div>
        <button
          onClick={() => {
            const newMode = "initial";
            setMode(newMode);
            onModeChange?.(newMode);
            setRetrieveCode("");
            setRetrievedPrayer("");
          }}
          className="cursor-pointer mt-6 text-black text-sm lowercase hover:text-black transition-colors"
        >
          go back
        </button>
      </div>
    );
  }

  // Show the access code after submission
  if (mode === "submitted") {
    return (
      <div className="flex flex-col items-center animate-in fade-in duration-500 mt-8">
        <button
          onClick={copyToClipboard}
          className="w-[300px] border border-black rounded-full py-3 px-6 text-center text-black text-lg tracking-wider hover:bg-black/5 transition-colors cursor-pointer"
        >
          {accessCode}
        </button>
        <p className="mt-4 text-black text-sm">
          {copied
            ? "copied!"
            : "click to copy your unique code to access your prayer next year."}
        </p>
        <p
          onClick={() => {
            const newMode = "initial";
            setMode(newMode);
            onModeChange?.(newMode);
            setAccessCode("");
            setCopied(false);
          }}
          className="cursor-pointer mt-6 text-black text-sm lowercase hover:text-black transition-colors"
        >
          go back
        </p>
      </div>
    );
  }

  // Submit mode - show the prayer form
  return (
    <>
      <div className="flex flex-col items-center animate-in fade-in duration-500">
        <motion.div
          className="flex items-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-black text-lg mt-4">
            submit your prayer for 2026.
          </p>
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-black hover:opacity-70 transition-opacity mt-4 cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.textarea
          value={prayerText}
          onChange={(e) => setPrayerText(e.target.value)}
          className="w-[300px] h-[200px] pro-max:w-[600px] pro-max:h-[400px] border-2 border-black rounded-[20px] p-4 bg-transparent text-black resize-none focus:outline-none focus:ring-1 focus:ring-black/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        />

        <motion.button
          onClick={handleSubmit}
          disabled={!prayerText.trim()}
          className={`mt-3  text-lg lowercase hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
            !prayerText.trim()
              ? "opacity-30 cursor-not-allowed text-black/50"
              : "text-black"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
        >
          submit
        </motion.button>

        <motion.button
          onClick={() => {
            const newMode = "initial";
            setMode(newMode);
            onModeChange?.(newMode);
          }}
          className="mt-4 text-black text-sm lowercase hover:text-black transition-colors cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.6 }}
        >
          go back
        </motion.button>
      </div>

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </>
  );
}
