"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TimezoneSetter() {
  const router = useRouter();

  useEffect(() => {
    try {
      // Use the explicitly imported module rather than relying on global scope
      const clientTimezone = Temporal.Now.timeZoneId();

      const existingTimezone = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user-timezone="))
        ?.split("=")[1];

      if (clientTimezone !== existingTimezone) {
        document.cookie = `user-timezone=${clientTimezone}; path=/; max-age=31536000; SameSite=Lax`;
        router.refresh();
      }
    } catch (err) {
      // If it throws in production, this will catch it
      console.error("TimezoneSetter failed in production:", err);
    }
  }, [router]);

  return null;
}
