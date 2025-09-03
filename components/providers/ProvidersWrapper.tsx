"use client"

import { SessionProvider } from "next-auth/react";
import React from "react";
import AppInitialiser from "./AppInitialiser";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AlertProvider } from "@/components/providers/AlertProvider";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <SessionProvider
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
        <AlertProvider>
        <AppInitialiser>
          {children}
        </AppInitialiser>
        </AlertProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
