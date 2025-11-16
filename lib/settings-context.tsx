"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Settings } from "./types";
import { detectTimezone } from "./time-utils";

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  boostMultiplier: 10,
  alertThresholdMinutes: 10,
  timezone: detectTimezone(),
  notificationSound: "/default-notification.mp3", // We'll add a default sound
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("coc-boost-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("coc-boost-settings", JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
