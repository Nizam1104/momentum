"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginSearchParams() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("login");
  const router = useRouter();

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "register" || modeParam === "login") {
      setMode(modeParam);
    } else {
      setMode("login"); // Default mode
    }
  }, [searchParams]);

  const toggleMode = (newMode: string) => {
    setMode(newMode);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    router.push(url.pathname + url.search, { scroll: false });
  };

  return { mode, toggleMode };
}