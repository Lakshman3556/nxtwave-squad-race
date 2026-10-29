import { NextRequest, NextResponse } from "next/server";
import { SquadRaceDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDemo = searchParams.get("demo") !== "false"; // Default to demo for rich view

    const data = SquadRaceDB.getGrowthDashboard(isDemo);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    console.error("Growth dashboard error:", err);
    return NextResponse.json({ success: false, message: "Error fetching growth metrics" }, { status: 500 });
  }
}
