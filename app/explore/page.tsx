"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPrayerCount, getRandomPrayers } from "@/lib/firestore-service";
import confetti from "canvas-confetti";

// Simple hash function to generate deterministic seed from date string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get today's date as YYYY-MM-DD string (with optional offset)
function getTodayDateString(dayOffset: number = 1): string {
  const now = new Date();
  now.setDate(now.getDate() + dayOffset);
  return now.toISOString().split("T")[0];
}

export default function ExplorePage() {
  const [prayerCount, setPrayerCount] = useState<number | null>(null);
  const [dailyPrayer, setDailyPrayer] = useState<{
    prayer: string;
    color?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prayersPool, setPrayersPool] = useState<
    Array<{ prayer: string; color?: string }>
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch prayer count
        const count = await getPrayerCount();
        setPrayerCount(count);

        // Fetch random prayers
        const prayers = await getRandomPrayers(50);

        if (prayers.length > 0) {
          // Store prayers pool
          setPrayersPool(prayers);
          // Use today's date to deterministically select a prayer
          const dateString = getTodayDateString();
          const seed = hashString(dateString);
          const selectedIndex = seed % prayers.length;
          setDailyPrayer(prayers[selectedIndex]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching prayer data:", err);
        setError("Failed to load prayer data. Please try again later.");
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Update prayer daily at midnight
  useEffect(() => {
    if (prayersPool.length === 0) return;

    // Function to update prayer based on current date
    const updateDailyPrayer = () => {
      const dateString = getTodayDateString();
      const seed = hashString(dateString);
      const selectedIndex = seed % prayersPool.length;
      setDailyPrayer(prayersPool[selectedIndex]);
    };

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    let dailyInterval: NodeJS.Timeout | null = null;

    // Set timeout for midnight, then check daily
    const midnightTimeout = setTimeout(() => {
      updateDailyPrayer();
      // After first midnight update, check every 24 hours
      dailyInterval = setInterval(updateDailyPrayer, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      clearTimeout(midnightTimeout);
      if (dailyInterval) clearInterval(dailyInterval);
    };
  }, [prayersPool]);

  // Prevent body scrolling on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Confetti function
  const triggerConfetti = () => {
    const colors = dailyPrayer?.color
      ? [dailyPrayer.color, "#ffffff", "#f0f0f0"]
      : ["#9333ea", "#ffffff", "#f0f0f0"];

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-screen overflow-hidden flex items-start justify-center"
    >
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .prayer-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .prayer-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        .prayer-scroll::-webkit-scrollbar-thumb {
          background: ${dailyPrayer?.color || "#9CA3AF"};
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .prayer-scroll::-webkit-scrollbar-thumb:hover {
          background: ${dailyPrayer?.color
            ? `${dailyPrayer.color}dd`
            : "#6B7280"};
        }
      `}</style>

      <div className="max-w-md mx-auto px-6 flex flex-col items-center mt-3">
        {/* Prayer Count Header */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl md:text-7xl text-black font-normal mb-8 text-center"
        >
          {isLoading
            ? "loading..."
            : error
            ? "- Prayers"
            : `${prayerCount} Prayers`}
        </motion.h1>

        {/* Large Circular Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-44 h-44 pro-max:w-50 pro-max:h-50 md:w-55 md:h-55 rounded-full mb-8 cursor-pointer"
          onClick={triggerConfetti}
          style={{
            backgroundColor: dailyPrayer?.color || "#D1D5DB",
          }}
        />

        {/* Description Text - Scrollable */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="prayer-scroll text-center text-base pro-max:text-[17px] md:text-base text-black leading-relaxed mb-16 max-w-sm w-full max-h-64 overflow-y-auto px-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${
              dailyPrayer?.color || "#9CA3AF"
            } rgba(0, 0, 0, 0.05)`,
          }}
        >
          <p className="whitespace-pre-wrap">
            {isLoading
              ? "loading prayer..."
              : error
              ? error
              : dailyPrayer?.prayer ||
                "No prayers available yet. Be the first to submit one!"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
