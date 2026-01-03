"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        className=" fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        onClick={onClose}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div
          className="relative w-full max-w-[500px] bg-white border border-black rounded-[30px] p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-black hover:opacity-70 transition-opacity"
          >
            <X className="w-6 h-6 stroke-3" />
          </button>

          <div className="space-y-6 pt-2 font-serif text-md leading-relaxed text-black">
            <p>
              every prayer is encrypted and sent into the orb as a color
              pigment. collectively, each prayer will shift the color we create
              in the orb. in mid 2026, we will extract 10,000 prayers from the
              orb and create a physical installation with them.
            </p>
            <p>
              when you submit a prayer, you will be given a 10 digit code to
              access this prayer on the 1st day of every month as a reminder of
              your wish.
            </p>
            <p>
              On January 1st, 2027, all prayers will be deleted in place for new
              ones. 2026prayer is a bamtone project; as we are always in search
              of new colors and the methods for creating them.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
