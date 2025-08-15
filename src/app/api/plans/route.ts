import { NextRequest, NextResponse } from "next/server";
import { getDb } from "~/lib/db";
import { z } from "zod";

const TripDayItem = z.object({
  time: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  placeQuery: z.string().optional(),
  // Allow any string for type to accommodate AI output like "travel", "nature", etc.
  type: z.string().optional(),
  coordinates: z.object({ lat: z.number(), lon: z.number() }).optional(),
  placeId: z.string().optional(),
});

const TripDay = z.object({
  date: z.string().optional(),
  summary: z.string().optional(),
  items: z.array(TripDayItem),
});

const TripPlan = z.object({
  id: z.string(),
  name: z.string(),
  homeAirport: z.string().optional(),
  travelers: z.number().int().positive(),
  budgetLevel: z.enum(["low", "medium", "high"]),
  interests: z.array(z.string()),
  constraints: z.array(z.string()),
  destinations: z.array(z.string()).optional(),
  estimatedCostUSD: z.number().optional(),
  days: z.array(TripDay),
});

export async function GET() {
  try {
    const db = await getDb();
    const plans = await db
      .collection("plans")
      .find({}, { projection: { _id: 1, plan: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    type PlanDoc = { _id: unknown; plan: unknown; createdAt?: unknown };
    const normalized = (plans as PlanDoc[]).map((p: PlanDoc) => ({
      _id: String(p._id),
      ...(p.plan as object),
      createdAt: p.createdAt,
    }));
    return NextResponse.json(normalized, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TripPlan.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const db = await getDb();
    const doc = { plan: parsed.data, createdAt: new Date() };
    const res = await db.collection("plans").insertOne(doc);
    return NextResponse.json({
      _id: String(res.insertedId),
      ...parsed.data,
      createdAt: doc.createdAt,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "DB error", details: e },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
