import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("place_id") || searchParams.get("id");
  if (!placeId)
    return NextResponse.json({ error: "place_id required" }, { status: 400 });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" },
      { status: 500 },
    );

  const fields = [
    "name",
    "photos",
    "rating",
    "user_ratings_total",
    "reviews",
    "formatted_address",
    "geometry",
    "opening_hours",
    "website",
    "url",
    "place_id",
  ].join(",");

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId,
    )}&fields=${fields}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("/api/places/details error", error);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
