"use client";

import { useState } from "react";
import { useTripStore } from "~/store/tripStore";

type Props = {
  onComplete: () => void;
};

export default function Onboarding({ onComplete }: Props) {
  const { upsertPlan } = useTripStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("My Trip");
  const [destinationHint, setDestinationHint] = useState("Tokyo");
  const [interests, setInterests] = useState("food, museums, nature");
  const [loading, setLoading] = useState(false);

  async function createPlan() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationHint,
          interests: interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          travelers: 2,
          budgetLevel: "medium",
        }),
      });
      const json = await res.json();
      const plan = {
        id: crypto.randomUUID(),
        name,
        travelers: 2,
        budgetLevel: "medium" as const,
        interests: interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        constraints: [],
        destinations: json.itinerary?.destinations ?? [],
        estimatedCostUSD: json.itinerary?.estimatedCostUSD,
        days: json.itinerary?.days ?? [],
      };
      upsertPlan(plan);
      try {
        await fetch("/api/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(plan),
        });
      } catch {}
      onComplete();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-zinc-900">
        <div className="text-lg font-semibold mb-4">Welcome to The Company</div>
        {step === 1 && (
          <div className="space-y-3">
            <label className="text-sm block">Trip name</label>
            <input
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="mt-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm"
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <label className="text-sm block">Destination hint</label>
            <input
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              value={destinationHint}
              onChange={(e) => setDestinationHint(e.target.value)}
            />
            <label className="text-sm block">Interests</label>
            <input
              className="w-full rounded-md border px-3 py-2 bg-transparent"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2">
              <button
                className="rounded-md border px-4 py-2 text-sm"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm disabled:opacity-60"
                onClick={createPlan}
                disabled={loading}
              >
                {loading ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
