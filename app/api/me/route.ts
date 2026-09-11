import { NextResponse } from "next/server";
import { readPlan } from "@/lib/session";

export async function GET() {
  const plan = await readPlan();
  return NextResponse.json({ plan });
}
