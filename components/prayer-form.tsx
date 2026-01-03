"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { InfoModal } from "./info-modal";
import { motion } from "framer-motion";
import { savePrayer, getPrayer } from "../lib/firestore-service";
import { SketchPicker } from "react-color";

// Detect iOS devices
const isIOS = () => {
  if (typeof window === "undefined") return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

// Check if today is the 1st of the month
function canAccessPrayer(): boolean {
  const now = new Date();
  return now.getDate() === 1;
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
  const [retrievedPrayerColor, setRetrievedPrayerColor] = useState<
    string | undefined
  >(undefined);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [manualColor, setManualColor] = useState("#9333ea");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );

  const handleManualColorSelect = () => {
    setSelectedColor(manualColor);
    setShowColorPicker(false);
  };

  const handleSubmit = async () => {
    if (!prayerText.trim() || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      // Generate unique 10-digit access code
      const code = generateAccessCode();
      setAccessCode(code);

      // Save prayer as plain text to Firestore with optional color
      await savePrayer(code, prayerText, selectedColor);

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
          setIsLoading(false);
        });
      }, delay);
    } catch (err) {
      setIsLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "failed to save your prayer. please try again."
      );
    }
  };

  const handleRetrieve = async () => {
    if (isLoading) return;

    setError("");

    // Validate code format (10 digits)
    if (!/^\d{10}$/.test(retrieveCode)) {
      setError("please enter a valid 10-digit code.");
      return;
    }

    setIsLoading(true);

    try {
      // Retrieve from Firestore
      const prayerData = await getPrayer(retrieveCode);

      if (!prayerData) {
        setIsLoading(false);
        setError("no prayer found with this code.");
        return;
      }

      // Check if today is the 1st of the month
      if (!canAccessPrayer()) {
        setIsLoading(false);
        setError("your prayer can only be viewed on the 1st of each month.");
        return;
      }

      setRetrievedPrayer(prayerData.prayer);
      setRetrievedPrayerColor(prayerData.color);

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
          setIsLoading(false);
        });
      }, delay);
    } catch (err) {
      setIsLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "failed to retrieve your prayer. please try again."
      );
    }
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

        {canAccessPrayer() && (
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
        )}
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
            // Lock viewport position on iOS to prevent scrolling
            if (isIOS()) {
              document.body.style.position = "fixed";
              document.body.style.top = `-${window.scrollY}px`;
              document.body.style.width = "100%";
            }
          }}
          onBlur={() => {
            // Unlock viewport on iOS
            if (isIOS()) {
              const scrollY = document.body.style.top;
              document.body.style.position = "";
              document.body.style.top = "";
              document.body.style.width = "";
              window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }
          }}
          placeholder="0000000000"
          className="w-[300px] border border-black rounded-full py-3 px-6 text-center text-black text-lg tracking-wider bg-transparent focus:outline-none focus:ring-1 focus:ring-black/20"
          maxLength={10}
        />
        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleRetrieve}
          disabled={retrieveCode.length !== 10 || isLoading}
          className="mt-4 cursor-pointer text-black text-lg lowercase hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isLoading ? "loading..." : "access prayer"}
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
        {retrievedPrayerColor && (
          <>
            <p className="text-black text-lg mb-4 mt-6">
              your 2026 prayer color:
            </p>
            <div className="w-[300px] border border-black rounded-[20px] p-4 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border border-black/20"
                style={{ backgroundColor: retrievedPrayerColor }}
              />
              <span className="text-black text-base">
                {retrievedPrayerColor}
              </span>
            </div>
          </>
        )}
        <button
          onClick={() => {
            const newMode = "initial";
            setMode(newMode);
            onModeChange?.(newMode);
            setRetrieveCode("");
            setRetrievedPrayer("");
            setRetrievedPrayerColor(undefined);
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
            setPrayerText(""); // Clear prayer text when going back
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
      <motion.div
        className="flex flex-col items-center "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeIn" }}
      >
        <div className="flex items-center gap-2 mb-8">
          <p className="text-black text-lg mt-4">
            submit your prayer for 2026.
          </p>
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-black hover:opacity-70 transition-opacity mt-4 cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="mt-2 mb-4 text-red-500 text-sm">{error}</p>}

        <div className="relative w-[300px] h-[200px] pro-max:w-[350px]">
          {/* Animated border SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="20"
              ry="20"
              fill="none"
              stroke="#9333ea"
              strokeWidth="2"
              strokeDasharray="60 1000"
              style={{
                animation: "dash-textarea 10s linear infinite",
              }}
            />
          </svg>
          {/* Static border */}
          <textarea
            value={prayerText}
            onChange={(e) => setPrayerText(e.target.value)}
            onFocus={() => {
              // Lock viewport position on iOS to prevent scrolling
              if (isIOS()) {
                document.body.style.position = "fixed";
                document.body.style.top = `-${window.scrollY}px`;
                document.body.style.width = "100%";
              }
            }}
            onBlur={() => {
              // Unlock viewport on iOS
              if (isIOS()) {
                const scrollY = document.body.style.top;
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
              }
            }}
            className="w-full h-full border border-black/60 rounded-[20px] p-4 bg-transparent text-black resize-none focus:outline-none"
          />
          {/* color picker button */}
          <div
            onClick={() => setShowColorPicker(true)}
            className="w-full mx-auto flex flex-col gap-2 justify-center items-center mt-2 cursor-pointer"
          >
            {selectedColor ? (
              <div
                className="w-6 h-6 rounded-full border border-black/20"
                style={{ backgroundColor: selectedColor }}
              />
            ) : (
              <img
                src="https://bamtone-social.vercel.app/color-picker-button.png"
                alt=""
                className="w-6 h-6"
              />
            )}
            <p className="text-black text-md lowercase hover:text-black transition-colors">
              {selectedColor ? "change color" : "add color"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            prayerText.trim().split(/\s+/).filter(Boolean).length < 2 ||
            isLoading
          }
          className={`mt-20  text-lg lowercase hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
            prayerText.trim().split(/\s+/).filter(Boolean).length < 2 ||
            isLoading
              ? "opacity-30 cursor-not-allowed text-black/50"
              : "text-black"
          }`}
        >
          {isLoading ? "saving..." : "submit"}
        </button>

        <button
          onClick={() => {
            const newMode = "initial";
            setMode(newMode);
            onModeChange?.(newMode);
          }}
          className="hidden mt-4 text-black text-sm lowercase hover:text-black transition-colors cursor-pointer"
        >
          go back
        </button>
      </motion.div>

      {showColorPicker && (
        <motion.div
          className="fixed -top-[195px] pro-max:-top-44 md:-top-48 left-1/2 w-full max-w-md -translate-x-1/2 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowColorPicker(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="relative w-[90%] max-w-sm rounded-3xl border border-white/5
                       bg-white backdrop-blur-sm p-8 shadow-2xl shadow-black/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowColorPicker(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-black hover:bg-white/20 transition duration-300 cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6 pt-1">
              <h2 className="text-lg font-extrabold tracking-normal text-black mb-1.5 uppercase">
                Pick a Color
              </h2>
              {/* <p className="text-sm text-black">
                Choose your perfect shade manually.
              </p> */}
            </div>

            {/* Color Picker */}
            <div className="flex justify-center mb-6 my-picker-wrapper">
              <SketchPicker
                color={manualColor}
                onChange={(color) => setManualColor(color.hex)}
                disableAlpha={true}
                presetColors={[
                  "#D0021B",
                  "#F5A623",
                  "#F8E71C",
                  "#8B572A",
                  "#7ED321",
                  "#417505",
                  "#BD10E0",
                  "#9013FE",
                  "#4A90E2",
                  "#50E3C2",
                  "#B8E986",
                  "#000000",
                  "#4A4A4A",
                  "#9B9B9B",
                ]}
                styles={{
                  default: {
                    picker: {
                      boxShadow: "none",
                      borderRadius: "12px",
                      width: "100%",
                    },
                  },
                }}
              />
            </div>

            {/* Color Preview and Hex */}
            <div className="flex items-center gap-4 mb-6 ml-1">
              <div
                className="w-8 h-8 shadow-md"
                style={{ backgroundColor: manualColor }}
              />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Selected Color
                </p>
                <p className="text-sm font-extrabold text-black uppercase">
                  {manualColor}
                </p>
              </div>
            </div>

            {/* Manual Select Button */}
            <button
              onClick={handleManualColorSelect}
              className="flex w-full items-center justify-center gap-3
                         bg-black px-6 py-2.5 text-sm font-extrabold
                         text-white shadow-md transition
                         hover:bg-black/80 cursor-pointer"
            >
              CHOOSE THIS COLOR
            </button>
          </motion.div>
        </motion.div>
      )}

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </>
  );
}
