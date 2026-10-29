import { NextResponse } from "next/server";
import { SquadRaceDB } from "@/lib/db";

export async function GET() {
  try {
    const colleges = SquadRaceDB.getColleges();
    const demoLeaderboard = SquadRaceDB.getLeaderboard(true);
    const liveLeaderboard = SquadRaceDB.getLeaderboard(false);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime_seconds: process.uptime(),
      database: {
        engine: "Embedded Relational Engine (Supabase-compatible)",
        status: "connected",
        colleges_count: colleges.length,
        live_registrations: liveLeaderboard.totalRegistrations,
        demo_registrations: demoLeaderboard.totalRegistrations,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database connection failed";
    return NextResponse.json(
      {
        status: "degraded",
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
