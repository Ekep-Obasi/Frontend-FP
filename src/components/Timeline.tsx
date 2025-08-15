import { TripPlan } from "~/store/tripStore";
import { useUIStore } from "~/store/uiStore";

export default function Timeline({ plan }: { plan: TripPlan }) {
  const openPlace = useUIStore((s) => s.openPlace);
  return (
    <div className="space-y-4">
      {plan.days.map((day, idx) => (
        <div key={idx} className="rounded-xl border border-black/10 dark:border-white/10 p-4">
          <div className="font-semibold mb-2">{day.date ?? `Day ${idx + 1}`}</div>
          {day.summary && <div className="text-sm text-zinc-500 mb-3">{day.summary}</div>}
          <ol className="relative ml-3">
            {day.items.map((item, j) => (
              <li key={j} className="pl-6 mb-3 cursor-pointer" onClick={() => {
                const name = item.placeQuery || item.title;
                openPlace({ query: name, placeId: item.placeId, lat: item.coordinates?.lat, lon: item.coordinates?.lon, title: item.title });
              }}>
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-600" />
                <div className="text-sm">
                  <span className="font-medium">{item.time ? `${item.time} · ` : null}{item.title}</span>
                  {item.description && <span className="text-zinc-500"> — {item.description}</span>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}


