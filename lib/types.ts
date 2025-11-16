export interface Upgrade {
  id: string;
  name: string;
  originalTimeMinutes: number; // Total original time in minutes
  boostedTimeMinutes: number; // Total boosted time in minutes
  remainingMinutes: number; // Remaining boosted time in minutes
  startTime: number; // Timestamp when timer started
  finishTime: number; // Timestamp when timer will finish
  isActive: boolean;
  hasNotified: boolean; // Track if notification has been sent
}

export interface Settings {
  boostMultiplier: number; // Default 10x
  alertThresholdMinutes: number; // Default 10 minutes
  timezone: string; // User's timezone
  notificationSound: string; // URL or path to sound file
}

export interface TimeInput {
  hours: number;
  minutes: number;
}
