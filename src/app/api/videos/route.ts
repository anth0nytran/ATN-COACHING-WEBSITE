import { NextResponse } from "next/server";
import list from "@/data/videos.json" assert { type: "json" };

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET() {
  // Serve a curated list to avoid bundling the entire public/videos directory
  return NextResponse.json(Array.isArray(list) ? list : []);
}


