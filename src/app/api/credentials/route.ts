import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dir = join(process.cwd(), "public", "credentials");
    const files = await readdir(dir, { withFileTypes: true }).catch(() => []);
    const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
    const list = files
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((name) => allowed.has(name.slice(name.lastIndexOf(".")).toLowerCase()));
    return NextResponse.json(list);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}


