"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--color-surface)",
          color: "var(--color-text)",
          border: "var(--border-w) solid var(--color-border)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-retro)",
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );
}
