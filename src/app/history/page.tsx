"use client";

import useSWR, { mutate } from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TripPlan, useTripStore } from "~/store/tripStore";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Plan = {
  _id?: string;
  id: string;
  name: string;
  destinations?: string[];
  travelers: number;
  budgetLevel: "low" | "medium" | "high";
  interests: string[];
  constraints: string[];
  estimatedCostUSD?: number;
  days: unknown[];
  createdAt?: string;
};

export default function HistoryPage() {
  const { data, isLoading } = useSWR<TripPlan[]>("/api/plans", fetcher);
  const { upsertPlan, setActivePlan } = useTripStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  const router = useRouter();

  async function rename(_id: string, plan: Plan) {
    const body = { ...plan, name: newName };
    await fetch(`/api/plans/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditingId(null);
    setNewName("");
    mutate("/api/plans");
  }

  async function remove(_id: string) {
    await fetch(`/api/plans/${_id}`, { method: "DELETE" });
    mutate("/api/plans");
  }

  async function duplicate(plan: Plan) {
    const dupe = {
      ...plan,
      id: crypto.randomUUID(),
      name: plan.name + " (copy)",
    };
    await fetch(`/api/plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dupe),
    });
    mutate("/api/plans");
  }

  function setActive(plan: TripPlan) {
    upsertPlan(plan);
    setActivePlan(plan.id);
  }

  function openPlan(plan: TripPlan) {
    upsertPlan(plan);
    setActivePlan(plan.id);
    router.push(`/itinerary/${plan.id}`);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-xl font-semibold">History</div>
      {isLoading ? (
        <div className="text-sm text-zinc-500">Loading…</div>
      ) : !data || data.length === 0 ? (
        <div className="text-sm text-zinc-500">No saved itineraries yet.</div>
      ) : (
        <div className="space-y-3">
          {data.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border p-4 bg-background"
            >
              <div className="flex items-center justify-between gap-4">
                <button
                  className="min-w-0 text-left"
                  onClick={() => openPlan(p)}
                  title="Open itinerary"
                >
                  <div className="font-medium truncate underline-offset-2 hover:underline">
                    {p.name}
                  </div>
                  <div className="text-xs text-zinc-500 truncate">
                    {p.destinations?.join(", ")}
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md bg-primary text-primary-foreground px-3 py-1 text-sm"
                    onClick={() => openPlan(p)}
                  >
                    Open
                  </button>
                  <button
                    className="rounded-md border px-3 py-1 text-sm"
                    onClick={() => setActive(p)}
                  >
                    Set active
                  </button>
                  <button
                    className="rounded-md border px-3 py-1 text-sm"
                    onClick={() => duplicate(p)}
                  >
                    Duplicate
                  </button>
                  {editingId === p._id ? (
                    <>
                      <input
                        className="rounded-md border px-2 py-1 text-sm bg-transparent"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                      <button
                        className="rounded-md bg-primary text-primary-foreground px-3 py-1 text-sm"
                        onClick={() => rename(p._id as string, p)}
                      >
                        Save
                      </button>
                      <button
                        className="rounded-md border px-3 py-1 text-sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="rounded-md border px-3 py-1 text-sm"
                      onClick={() => {
                        setEditingId(p._id || null);
                        setNewName(p.name);
                      }}
                    >
                      Rename
                    </button>
                  )}
                  <button
                    className="rounded-md border px-3 py-1 text-sm"
                    onClick={() => remove(p._id as string)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
