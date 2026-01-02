"use client";

import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { SplineContainer } from "@/components/spline-container";
import { PrayerContent } from "@/components/prayer-content";

export function AnimatedPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen items-center justify-center overflow-hidden"
    >
      <SplineContainer>
        <Spline scene="https://prod.spline.design/7NkEcxJIREoCgQCa/scene.splinecode" />
      </SplineContainer>
      <main className="flex h-screen w-full max-w-3xl flex-col items-center bg-white dark:bg-white z-10">
        <PrayerContent />
      </main>
    </motion.div>
  );
}
