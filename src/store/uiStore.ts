import { create } from "zustand";
import { persist } from "zustand/middleware";

type Marker = { id: string; lat: number; lon: number; title?: string };

type UIState = {
  placeModalOpen: boolean;
  selectedPlaceId?: string;
  selectedQuery?: string;
  selectedCoordinates?: { lat: number; lon: number };
  openPlace: (args: { placeId?: string; query?: string; lat?: number; lon?: number; title?: string }) => void;
  closePlace: () => void;

  mapCenter: { lat: number; lon: number };
  mapMarkers: Marker[];
  setMapTo: (center: { lat: number; lon: number }, markers?: Marker[]) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      placeModalOpen: false,
      selectedPlaceId: undefined,
      selectedQuery: undefined,
      selectedCoordinates: undefined,
      openPlace: ({ placeId, query, lat, lon, title }) => {
        const marker: Marker | undefined = lat !== undefined && lon !== undefined
          ? { id: placeId || query || "marker", lat, lon, title }
          : undefined;
        if (marker) {
          const markers = [marker];
          set({ mapCenter: { lat: marker.lat, lon: marker.lon }, mapMarkers: markers });
        }
        set({ placeModalOpen: true, selectedPlaceId: placeId, selectedQuery: query, selectedCoordinates: lat && lon ? { lat, lon } : undefined });
      },
      closePlace: () => set({ placeModalOpen: false, selectedPlaceId: undefined, selectedQuery: undefined, selectedCoordinates: undefined }),

      mapCenter: { lat: 40.7128, lon: -74.006 },
      mapMarkers: [],
      setMapTo: (center, markers) => set({ mapCenter: center, mapMarkers: markers ?? get().mapMarkers }),
    }),
    { name: "ui-store" }
  )
);


