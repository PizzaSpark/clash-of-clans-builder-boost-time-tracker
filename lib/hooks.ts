"use client";

import { useState, useEffect, useCallback } from "react";
import { Upgrade } from "./types";
import {
  calculateBoostedTime,
  getCurrentTime,
  calculateRemainingMinutes,
  generateId,
} from "./time-utils";

export function useUpgrades() {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load upgrades from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("coc-boost-upgrades");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUpgrades(parsed);
      } catch (error) {
        console.error("Failed to parse saved upgrades:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save upgrades to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("coc-boost-upgrades", JSON.stringify(upgrades));
    }
  }, [upgrades, isLoaded]);

  const addUpgrade = useCallback(
    (name: string, originalMinutes: number, boostMultiplier: number) => {
      const boostedMinutes = calculateBoostedTime(originalMinutes, boostMultiplier);
      const startTime = getCurrentTime();
      const finishTime = startTime + boostedMinutes * 60 * 1000;

      const newUpgrade: Upgrade = {
        id: generateId(),
        name,
        originalTimeMinutes: originalMinutes,
        boostedTimeMinutes: boostedMinutes,
        remainingMinutes: boostedMinutes,
        startTime,
        finishTime,
        isActive: true,
        hasNotified: false,
      };

      setUpgrades((prev) => [...prev, newUpgrade]);
      return newUpgrade.id;
    },
    []
  );

  const removeUpgrade = useCallback((id: string) => {
    setUpgrades((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const pauseUpgrade = useCallback((id: string) => {
    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === id && u.isActive) {
          const remaining = calculateRemainingMinutes(u.finishTime);
          return { ...u, isActive: false, remainingMinutes: remaining };
        }
        return u;
      })
    );
  }, []);

  const resumeUpgrade = useCallback((id: string) => {
    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === id && !u.isActive) {
          const now = getCurrentTime();
          const newFinishTime = now + u.remainingMinutes * 60 * 1000;
          return {
            ...u,
            isActive: true,
            startTime: now,
            finishTime: newFinishTime,
          };
        }
        return u;
      })
    );
  }, []);

  const markNotified = useCallback((id: string) => {
    setUpgrades((prev) =>
      prev.map((u) => (u.id === id ? { ...u, hasNotified: true } : u))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setUpgrades((prev) => {
      const now = getCurrentTime();
      return prev.filter((u) => u.finishTime > now);
    });
  }, []);

  return {
    upgrades,
    addUpgrade,
    removeUpgrade,
    pauseUpgrade,
    resumeUpgrade,
    markNotified,
    clearCompleted,
  };
}

export function useCountdown(finishTime: number, isActive: boolean) {
  const [remainingMinutes, setRemainingMinutes] = useState(() =>
    calculateRemainingMinutes(finishTime)
  );

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const remaining = calculateRemainingMinutes(finishTime);
      setRemainingMinutes(remaining);

      // Stop when complete
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [finishTime, isActive]);

  return remainingMinutes;
}

export function useNotification(
  upgrades: Upgrade[],
  alertThresholdMinutes: number,
  playSound: () => void,
  markNotified: (id: string) => void
) {
  useEffect(() => {
    const checkNotifications = () => {
      upgrades.forEach((upgrade) => {
        if (!upgrade.isActive || upgrade.hasNotified) return;

        const remaining = calculateRemainingMinutes(upgrade.finishTime);

        // Trigger notification when remaining time crosses threshold
        if (remaining > 0 && remaining <= alertThresholdMinutes) {
          // Play sound
          playSound();

          // Show browser notification if permitted
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("CoC Upgrade Alert!", {
                body: `${upgrade.name} will finish in ${Math.ceil(remaining)} minutes!`,
                icon: "/coc-icon.png",
              });
            }
          }

          markNotified(upgrade.id);
        }
      });
    };

    const interval = setInterval(checkNotifications, 5000); // Check every 5 seconds
    checkNotifications(); // Check immediately

    return () => clearInterval(interval);
  }, [upgrades, alertThresholdMinutes, markNotified, playSound]);

  const requestNotificationPermission = useCallback(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  return { requestNotificationPermission };
}
