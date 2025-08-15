"use client";

import useSWR from "swr";
import { useTripStore } from "~/store/tripStore";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type HistoryItem = {
  _id: string;
  id: string;
  name: string;
  destinations?: string[];
  createdAt?: string;
};

export default function HistoryList() {
  const { setActivePlan, upsertPlan } = useTripStore();
  const { data, isLoading } = useSWR<HistoryItem[]>("/api/plans", fetcher);

  if (isLoading) {
    return <div className="text-sm text-zinc-500">Loading history…</div>;
  }
  if (!data || data.length === 0) {
    return <div className="text-sm text-zinc-500">No history yet</div>;
  }

  console.log(data);

  return (
    <div className="space-y-2">
      {data.map((p) => (
        <button
          key={p._id}
          className="w-full text-left px-3 py-2 rounded-md border hover:bg-muted"
          onClick={async () => {
            // Ensure the plan appears locally too
            upsertPlan({
              id: p.id,
              name: p.name,
              travelers: 2,
              budgetLevel: "medium",
              interests: [],
              constraints: [],
              destinations: p.destinations ?? [],
              days: [],
            });
            setActivePlan(p.id);
          }}
        >
          <div className="text-sm font-medium truncate">{p.name}</div>
          {p.destinations && p.destinations.length > 0 ? (
            <div className="text-xs text-zinc-500 truncate">
              {p.destinations.join(", ")}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}
