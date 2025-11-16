import { TimeInput } from "./types";

/**
 * Convert hours and minutes to total minutes
 */
export function timeToMinutes(time: TimeInput): number {
  return time.hours * 60 + time.minutes;
}

/**
 * Convert minutes to hours and minutes
 */
export function minutesToTime(totalMinutes: number): TimeInput {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return { hours, minutes };
}

/**
 * Calculate boosted time based on original time and multiplier
 */
export function calculateBoostedTime(
  originalMinutes: number,
  boostMultiplier: number
): number {
  return originalMinutes / boostMultiplier;
}

/**
 * Format time as "Xh Ym" or "Xm" or "Xs"
 */
export function formatTime(totalMinutes: number): string {
  if (totalMinutes < 1) {
    const seconds = Math.ceil(totalMinutes * 60);
    return `${seconds}s`;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Parse time string like "5h 4m" or "30m" or "1h" into TimeInput
 */
export function parseTimeString(timeStr: string): TimeInput | null {
  const cleaned = timeStr.toLowerCase().trim();
  
  // Match patterns like "5h 4m", "5h", "4m"
  const hourMatch = cleaned.match(/(\d+)\s*h/);
  const minuteMatch = cleaned.match(/(\d+)\s*m/);
  
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  
  if (hours === 0 && minutes === 0) {
    return null;
  }
  
  return { hours, minutes };
}

/**
 * Format timestamp to readable date/time string in user's timezone
 */
export function formatFinishTime(timestamp: number, timezone: string): string {
  const date = new Date(timestamp);
  
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  } catch {
    // Fallback if timezone is invalid
    return date.toLocaleString();
  }
}

/**
 * Get current time in milliseconds
 */
export function getCurrentTime(): number {
  return Date.now();
}

/**
 * Calculate remaining minutes from start time, finish time, and current time
 */
export function calculateRemainingMinutes(finishTime: number): number {
  const now = getCurrentTime();
  const remainingMs = finishTime - now;
  return Math.max(0, remainingMs / 1000 / 60);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get list of common timezones
 */
export function getCommonTimezones(): string[] {
  return [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'America/Anchorage',
    'Pacific/Honolulu',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Bangkok',
    'Asia/Singapore',
    'Asia/Manila',
    'Asia/Jakarta',
    'Asia/Hong_Kong',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Pacific/Auckland',
  ];
}

/**
 * Detect user's timezone
 */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York';
  }
}
