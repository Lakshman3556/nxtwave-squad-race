import { NextRequest, NextResponse } from "next/server";
import { SquadRaceDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDemo = searchParams.get("demo") !== "false"; // Default to demo if query omitted or true

    const data = SquadRaceDB.getLeaderboard(isDemo);

    return NextResponse.json({
      success: true,
      isDemo,
      data,
    });
  } catch (err: unknown) {
    console.error("Leaderboard fetch error:", err);
    return NextResponse.json({ success: false, message: "Error fetching leaderboard" }, { status: 500 });
  }
}
