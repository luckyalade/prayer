"use client";

import { useState, useEffect } from "react";
import { PrayerForm } from "@/components/prayer-form";
import { motion } from "framer-motion";

export function PrayerContent() {
  const [showTextarea, setShowTextarea] = useState(false);

  // Hide scroll behavior when textarea is not displaying
  useEffect(() => {
    if (!showTextarea) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showTextarea]);

  return (
    <>
      <section className="flex flex-col items-center justify-center backdrop-blur-sm relative -top-12">
        {!showTextarea && (
          <motion.h1
            className="text-5xl md:text-6xl text-black font-semibold shadow-md shadow-transparent "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 1.2 }}
          >
            2026 Prayer
          </motion.h1>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 1.4 }}
        >
          <PrayerForm
            onModeChange={(mode) => setShowTextarea(mode !== "initial")}
          />
        </motion.div>
      </section>
      <motion.footer
        className={`${
          showTextarea ? "relative" : "fixed"
        } bottom-2 w-fit text-center backdrop-blur-sm shadow-2xl md:hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 1.6 }}
      >
        <a
          href="https://www.instagram.com/paul_the_simple"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black font-semibold text-lg "
        >
          created by paul the simple
        </a>
      </motion.footer>
      <motion.footer
        className="fixed bottom-2 w-fit text-center backdrop-blur-sm shadow-2xl hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 1.6 }}
      >
        <a
          href="https://www.instagram.com/paul_the_simple"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black font-semibold text-lg"
        >
          created by paul the simple
        </a>
      </motion.footer>
    </>
  );
}
