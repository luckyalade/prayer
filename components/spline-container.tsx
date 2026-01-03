"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { ReactNode } from "react";

interface SplineContainerProps {
  children: ReactNode;
}

export function SplineContainer({ children }: SplineContainerProps) {
  const isMobile = useIsMobile();

  return (
    <div
      onClick={() => (window.location.href = "/")}
      className="cursor-pointer"
      style={{
        width: "100%",
        maxWidth: "300px",
        height: isMobile ? "300px" : "300px",
        margin: "0 auto",
        position: "fixed",
        top: "-20px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </div>
  );
}
