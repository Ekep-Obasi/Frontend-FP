"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

type MapViewProps = {
  center?: { lat: number; lon: number };
  markers?: Array<{ id: string; lat: number; lon: number; title?: string }>; 
  fitBounds?: boolean;
};

export default function MapView({ center = { lat: 40.7128, lon: -74.006 }, markers = [], fitBounds = true }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
  
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey || "" });

  if (!apiKey) {
    return <div className="w-full h-[420px] rounded-xl overflow-hidden grid place-items-center border">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</div>;
  }

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: center.lat, lng: center.lon }}
          zoom={10}
          options={{ disableDefaultUI: true, zoomControl: true }}
          onLoad={(map: google.maps.Map) => {
            if (!fitBounds || markers.length === 0) return;
            const bounds = new google.maps.LatLngBounds();
            markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lon }));
            map.fitBounds(bounds, 48);
          }}
        >
          {markers.map((m) => (
            <Marker key={m.id} position={{ lat: m.lat, lng: m.lon }} title={m.title} />
          ))}
        </GoogleMap>
      ) : (
        <div className="w-full h-full grid place-items-center text-sm text-zinc-500">Loading map…</div>
      )}
    </div>
  );
}


