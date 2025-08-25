import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Resolve public/videos directory
    const dir = join(process.cwd(), "public", "videos");
    const files = await readdir(dir, { withFileTypes: true }).catch(() => []);
    const mp4s = files
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((n) => n.toLowerCase().endsWith(".mp4"));
    return NextResponse.json(mp4s);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}


