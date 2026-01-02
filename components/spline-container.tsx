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
        maxWidth: "650px",
        height: isMobile ? "440px" : "340px",
        margin: "0 auto",
        position: "relative",
        top: "-36px",
      }}
    >
      {children}
    </div>
  );
}
