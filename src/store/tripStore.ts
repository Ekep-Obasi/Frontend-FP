import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TripDayItem = {
  time?: string;
  title: string;
  description?: string;
  placeQuery?: string;
  type?: "sight" | "food" | "transport" | "activity" | "rest";
  coordinates?: { lat: number; lon: number };
  placeId?: string;
};

export type TripDay = {
  date?: string;
  summary?: string;
  items: TripDayItem[];
};

export type TripPlan = {
  _id?: string;
  id: string;
  name: string;
  homeAirport?: string;
  travelers: number;
  budgetLevel: "low" | "medium" | "high";
  interests: string[];
  constraints: string[];
  destinations?: string[];
  estimatedCostUSD?: number;
  days: TripDay[];
};

type TripState = {
  plans: TripPlan[];
  activePlanId?: string;
  setActivePlan: (id?: string) => void;
  upsertPlan: (plan: TripPlan) => void;
  removePlan: (id: string) => void;
  updateDayItem: (planId: string, dayIndex: number, itemIndex: number, item: Partial<TripDayItem>) => void;
};

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      plans: [],
      activePlanId: undefined,
      setActivePlan: (id) => set({ activePlanId: id }),
      upsertPlan: (plan) =>
        set((state) => {
          const existingIndex = state.plans.findIndex((p) => p.id === plan.id);
          if (existingIndex >= 0) {
            const plans = [...state.plans];
            plans[existingIndex] = plan;
            return { plans, activePlanId: plan.id };
          }
          return { plans: [plan, ...state.plans], activePlanId: plan.id };
        }),
      removePlan: (id) =>
        set((state) => ({ plans: state.plans.filter((p) => p.id !== id), activePlanId: state.activePlanId === id ? undefined : state.activePlanId })),
      updateDayItem: (planId, dayIndex, itemIndex, item) =>
        set((state) => {
          const plans = state.plans.map((p) => {
            if (p.id !== planId) return p;
            const days = [...p.days];
            const day = { ...days[dayIndex] };
            const items = [...day.items];
            items[itemIndex] = { ...items[itemIndex], ...item };
            day.items = items;
            days[dayIndex] = day;
            return { ...p, days };
          });
          return { plans };
        }),
    }),
    { name: "trip-store" }
  )
);


