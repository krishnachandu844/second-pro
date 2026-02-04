"use client";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
