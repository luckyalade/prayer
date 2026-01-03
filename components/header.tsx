"use client";

import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { SplineContainer } from "@/components/spline-container";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="cursor-pointer"
    >
      <SplineContainer>
        <Spline scene="https://prod.spline.design/7NkEcxJIREoCgQCa/scene.splinecode" />
      </SplineContainer>
    </motion.header>
  );
}
