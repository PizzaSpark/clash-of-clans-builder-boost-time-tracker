"use client";

import { Upgrade } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTime, formatFinishTime } from "@/lib/time-utils";
import { useCountdown } from "@/lib/hooks";
import { useSettings } from "@/lib/settings-context";
import { Pause, Play, Trash2, Clock, Timer, Calendar } from "lucide-react";

interface UpgradeCardProps {
  upgrade: Upgrade;
  onPause: () => void;
  onResume: () => void;
  onRemove: () => void;
}

export function UpgradeCard({ upgrade, onPause, onResume, onRemove }: UpgradeCardProps) {
  const { settings } = useSettings();
  const remainingMinutes = useCountdown(upgrade.finishTime, upgrade.isActive);
  const isComplete = remainingMinutes <= 0;

  return (
    <Card className={isComplete ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{upgrade.name}</CardTitle>
          <div className="flex gap-1">
            {!isComplete && (
              <>
                {upgrade.isActive ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPause}
                    className="h-8 w-8"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onResume}
                    className="h-8 w-8"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Original Time</p>
              <p className="font-medium">{formatTime(upgrade.originalTimeMinutes)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Boosted Time</p>
              <p className="font-medium">{formatTime(upgrade.boostedTimeMinutes)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {isComplete ? "Completed!" : upgrade.isActive ? "Time Remaining" : "Paused"}
            </span>
            <span className={`text-2xl font-bold ${isComplete ? "text-green-600" : ""}`}>
              {isComplete ? "Done! 🎉" : formatTime(remainingMinutes)}
            </span>
          </div>
          {!isComplete && upgrade.isActive && (
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-1000"
                style={{
                  width: `${((upgrade.boostedTimeMinutes - remainingMinutes) / upgrade.boostedTimeMinutes) * 100}%`,
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Finish Time</p>
            <p className="text-sm font-medium">
              {formatFinishTime(upgrade.finishTime, settings.timezone)}
            </p>
          </div>
        </div>

        {upgrade.hasNotified && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            🔔 Notification sent
          </p>
        )}
      </CardContent>
    </Card>
  );
}
