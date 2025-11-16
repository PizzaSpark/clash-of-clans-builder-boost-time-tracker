"use client";

import { AddUpgradeForm } from "@/components/add-upgrade-form";
import { UpgradeCard } from "@/components/upgrade-card";
import { SettingsDialog } from "@/components/settings-dialog";
import { Button } from "@/components/ui/button";
import { useUpgrades, useNotification } from "@/lib/hooks";
import { useSettings } from "@/lib/settings-context";
import { useAudioNotification } from "@/lib/audio-notification";
import { Trash2, Bell } from "lucide-react";

export default function Home() {
  const { settings } = useSettings();
  const {
    upgrades,
    addUpgrade,
    removeUpgrade,
    pauseUpgrade,
    resumeUpgrade,
    markNotified,
    clearCompleted,
  } = useUpgrades();

  const { playSound } = useAudioNotification(settings.notificationSound);
  const { requestNotificationPermission } = useNotification(
    upgrades,
    settings.alertThresholdMinutes,
    playSound,
    markNotified
  );

  const handleAddUpgrade = (name: string, originalMinutes: number) => {
    addUpgrade(name, originalMinutes, settings.boostMultiplier);
  };

  const activeUpgrades = upgrades.filter((u) => {
    const now = Date.now();
    return u.finishTime > now;
  });

  const completedUpgrades = upgrades.filter((u) => {
    const now = Date.now();
    return u.finishTime <= now;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              CoC Builder Boost Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your Clash of Clans upgrades with builder potion timing
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={requestNotificationPermission}
              title="Enable browser notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <SettingsDialog />
          </div>
        </div>

        {/* Add Upgrade Form */}
        <div className="mb-8">
          <AddUpgradeForm onAddUpgrade={handleAddUpgrade} />
        </div>

        {/* Active Upgrades */}
        {activeUpgrades.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Active Timers ({activeUpgrades.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeUpgrades.map((upgrade) => (
                <UpgradeCard
                  key={upgrade.id}
                  upgrade={upgrade}
                  onPause={() => pauseUpgrade(upgrade.id)}
                  onResume={() => resumeUpgrade(upgrade.id)}
                  onRemove={() => removeUpgrade(upgrade.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Upgrades */}
        {completedUpgrades.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Completed ({completedUpgrades.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompleted}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedUpgrades.map((upgrade) => (
                <UpgradeCard
                  key={upgrade.id}
                  upgrade={upgrade}
                  onPause={() => {}}
                  onResume={() => {}}
                  onRemove={() => removeUpgrade(upgrade.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {upgrades.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚔️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No upgrades being tracked
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add your first upgrade above to start tracking!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

