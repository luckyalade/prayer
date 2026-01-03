"use client";

import { useState, useEffect } from "react";
import { PrayerForm } from "@/components/prayer-form";
import { motion } from "framer-motion";

export function PrayerContent() {
  const [showTextarea, setShowTextarea] = useState(false);

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
        className="flex flex-col items-center justify-center backdrop-blur-sm relative -top-12 pro-max:-top-20 md:-top-12"
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
          <PrayerForm
            onModeChange={(mode) => setShowTextarea(mode !== "initial")}
          />
        </div>
      </motion.section>
      {/* <motion.footer
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
      </motion.footer> */}
      <motion.footer
        className="fixed bottom-2 w-fit text-center backdrop-blur-sm shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5, ease: "easeIn" }}
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
