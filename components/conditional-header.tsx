"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";

export function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on explore page
  if (pathname === "/explore") {
    return null;
  }

  return <Header />;
}
