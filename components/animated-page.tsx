"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PrayerContent } from "@/components/prayer-content";

export function AnimatedPage() {
  const [isEnterClicked, setIsEnterClicked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-screen overflow-hidden"
    >
      <main
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl flex flex-col items-center justify-center z-10 ${
          isEnterClicked
            ? "top-[400px] pro-max:top-[420px] md:top-[400px]"
            : "top-[310px] pro-max:top-[340px] md:top-[320px]"
        }`}
      >
        <PrayerContent
          onModeChange={(mode) => setIsEnterClicked(mode !== "initial")}
        />
      </main>
    </motion.div>
  );
}
