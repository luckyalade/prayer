"use client";

import { useState, useEffect } from "react";
import { PrayerForm } from "@/components/prayer-form";
import { motion } from "framer-motion";

interface PrayerContentProps {
  onModeChange?: (mode: string) => void;
}

export function PrayerContent({ onModeChange }: PrayerContentProps) {
  const [showTextarea, setShowTextarea] = useState(false);

  const handleModeChange = (mode: string) => {
    setShowTextarea(mode !== "initial");
    onModeChange?.(mode);
  };

  // Keep overflow hidden at all times to prevent scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <motion.section
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5, ease: "easeIn" }}
      >
        {!showTextarea && (
          <h1 className="text-5xl md:text-6xl text-black font-semibold shadow-md shadow-transparent ">
            2026 Prayer
          </h1>
        )}
        <div>
          <PrayerForm onModeChange={handleModeChange} />
        </div>
      </motion.section>
    </>
  );
}
