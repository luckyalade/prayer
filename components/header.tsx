"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { SplineContainer } from "@/components/spline-container";

export function Header() {
  const [isColorPickerActive, setIsColorPickerActive] = useState(false);

  useEffect(() => {
    // Check for color picker being active by polling the body class
    const checkColorPicker = () => {
      setIsColorPickerActive(
        document.body.classList.contains("color-picker-open")
      );
    };

    // Check immediately
    checkColorPicker();

    // Check every 100ms for changes
    const interval = setInterval(checkColorPicker, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="cursor-pointer"
    >
      <Link href="/explore">
        <div
          className="cursor-pointer"
          style={{
            position: "fixed",
            top: "-20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "300px",
            height: "250px",
            zIndex: isColorPickerActive ? 0 : 9999,
            // backgroundColor: "black",
          }}
        />
      </Link>
      <SplineContainer>
        <Spline scene="https://prod.spline.design/7NkEcxJIREoCgQCa/scene.splinecode" />
      </SplineContainer>
    </motion.header>
  );
}
