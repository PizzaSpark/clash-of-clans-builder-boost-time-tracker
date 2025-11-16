"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/lib/settings-context";
import { getCommonTimezones } from "@/lib/time-utils";
import { Settings, Bell, Upload } from "lucide-react";

export function SettingsDialog() {
  const { settings, updateSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoostMultiplierChange = (value: number[]) => {
    updateSettings({ boostMultiplier: value[0] });
  };

  const handleAlertThresholdChange = (value: number[]) => {
    updateSettings({ alertThresholdMinutes: value[0] });
  };

  const handleTimezoneChange = (timezone: string) => {
    updateSettings({ timezone });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the uploaded file
      const url = URL.createObjectURL(file);
      updateSettings({ notificationSound: url });
    }
  };

  const handleUseDefaultSound = () => {
    updateSettings({ notificationSound: "/default-notification.mp3" });
  };

  const timezones = getCommonTimezones();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your boost timer preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Boost Multiplier */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Boost Multiplier</Label>
              <span className="text-sm font-medium">{settings.boostMultiplier}×</span>
            </div>
            <Slider
              value={[settings.boostMultiplier]}
              onValueChange={handleBoostMultiplierChange}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Builder potions are typically 10×. Adjust if using different boosts.
            </p>
          </div>

          {/* Alert Threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alert Threshold
              </Label>
              <span className="text-sm font-medium">{settings.alertThresholdMinutes} min</span>
            </div>
            <Slider
              value={[settings.alertThresholdMinutes]}
              onValueChange={handleAlertThresholdChange}
              min={1}
              max={60}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Get notified when an upgrade has this much time remaining.
            </p>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={settings.timezone} onValueChange={handleTimezoneChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Finish times will be shown in this timezone.
            </p>
          </div>

          {/* Notification Sound */}
          <div className="space-y-2">
            <Label>Notification Sound</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Sound
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleUseDefaultSound}
              >
                Use Default
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-muted-foreground">
              Upload a custom notification sound (MP3, WAV, etc.)
            </p>
            {settings.notificationSound !== "/default-notification.mp3" && (
              <p className="text-xs text-green-600">✓ Custom sound uploaded</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
