"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseTimeString, timeToMinutes } from "@/lib/time-utils";
import { useSettings } from "@/lib/settings-context";

interface AddUpgradeFormProps {
  onAddUpgrade: (name: string, originalMinutes: number) => void;
}

export function AddUpgradeForm({ onAddUpgrade }: AddUpgradeFormProps) {
  const [name, setName] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [error, setError] = useState("");
  const { settings } = useSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter an upgrade name");
      return;
    }

    const parsedTime = parseTimeString(timeInput);
    if (!parsedTime) {
      setError("Invalid time format. Use format like '5h 30m' or '45m'");
      return;
    }

    const totalMinutes = timeToMinutes(parsedTime);
    if (totalMinutes <= 0) {
      setError("Time must be greater than 0");
      return;
    }

    onAddUpgrade(name, totalMinutes);
    setName("");
    setTimeInput("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Upgrade</CardTitle>
        <CardDescription>
          Enter upgrade details and remaining time. Time will be calculated at {settings.boostMultiplier}× boost speed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upgrade-name">Upgrade Name</Label>
            <Input
              id="upgrade-name"
              placeholder="e.g., Archer Tower Lvl 14"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remaining-time">Remaining Time</Label>
            <Input
              id="remaining-time"
              placeholder="e.g., 5h 30m or 45m"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Format: Xh Ym (e.g., "2h 15m" or just "45m")
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Start Timer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
