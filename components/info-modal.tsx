"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
      onClick={onClose}
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

        <div className="space-y-6 pt-2 font-serif text-lg leading-relaxed text-black">
          <p>
            when you submit your prayer, we will digitally encrypt it so it is
            never read. we will provide a 10 digit code that will give you
            access to your prayer on January 1st, 2027.
          </p>

          <p>
            The purpose of this project is to give us a space to envision whats
            possible, and imagine a canvas for it. what if these dreams and
            prayers become a collective idea over time? what if next year&apos;s
            prayer assumes we achieved our goals for this year&apos;s prayer?
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
