"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      className="fixed bottom-2 left-1/2 -translate-x-1/2 w-fit text-center backdrop-blur-sm"
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
  );
}
