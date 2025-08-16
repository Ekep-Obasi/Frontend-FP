"use client";

import { useState } from "react";
import {
  UtensilsCrossed,
  Landmark,
  Trees,
  Music,
  Camera,
  Bike,
  Wine,
  Sun,
  Mountain,
  HandCoins,
} from "lucide-react";

type Interest = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const INTERESTS: Interest[] = [
  { key: "food", label: "Food", icon: UtensilsCrossed },
  { key: "museums", label: "Museums", icon: Landmark },
  { key: "nature", label: "Nature", icon: Trees },
  { key: "music", label: "Music", icon: Music },
  { key: "photography", label: "Photography", icon: Camera },
  { key: "cycling", label: "Cycling", icon: Bike },
  { key: "wine", label: "Wine", icon: Wine },
  { key: "beaches", label: "Beaches", icon: Sun },
  { key: "hiking", label: "Hiking", icon: Mountain },
  { key: "budget", label: "Budget", icon: HandCoins },
];

export default function InterestsSelector({
  defaultSelected = ["food", "museums", "nature"],
  onChange,
}: {
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      onChange?.(next);
      return next;
    });
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {INTERESTS.map((i) => {
        const Icon = i.icon;
        const active = selected.includes(i.key);
        return (
          <button
            key={i.key}
            type="button"
            onClick={() => toggle(i.key)}
            aria-pressed={active}
            className={
              active
                ? "group flex items-center gap-2 rounded-xl border bg-primary text-primary-foreground px-4 py-3 shadow-sm ring-1 ring-primary/40 cursor-pointer"
                : "group flex items-center gap-2 rounded-xl border px-4 py-3 hover:bg-muted hover:border-primary/40"
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{i.label}</span>
          </button>
        );
      })}
    </div>
  );
}
