import { NextRequest, NextResponse } from "next/server";
import { getDb } from "~/lib/db";
import { ObjectId } from "mongodb";
import { z } from "zod";

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
  days: z.array(
    z.object({
      date: z.string().optional(),
      summary: z.string().optional(),
      items: z.array(
        z.object({
          time: z.string().optional(),
          title: z.string(),
          description: z.string().optional(),
          placeQuery: z.string().optional(),
          type: z.string().optional(),
          coordinates: z
            .object({ lat: z.number(), lon: z.number() })
            .optional(),
          placeId: z.string().optional(),
        }),
      ),
    }),
  ),
});

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();
    const doc = await db
      .collection("plans")
      .findOne({ _id: new ObjectId(params.id) });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(
      { _id: String(doc._id), ...doc.plan, createdAt: doc.createdAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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
    await db
      .collection("plans")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { plan: parsed.data } },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();
    await db.collection("plans").deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
