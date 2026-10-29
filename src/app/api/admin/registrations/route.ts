import { NextRequest, NextResponse } from "next/server";
import { SquadRaceDB } from "@/lib/db";

function verifyAdminKey(req: NextRequest): boolean {
  const envKey = process.env.ADMIN_KEY || "nxtwave_growth_2027";
  const { searchParams } = new URL(req.url);
  const keyParam = searchParams.get("key");
  const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");

  return keyParam === envKey || authHeader === envKey;
}

export async function GET(req: NextRequest) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized. Valid ADMIN_KEY required." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const isDemo = searchParams.get("demo") === "true";
  const format = searchParams.get("format");

  const registrations = SquadRaceDB.getAdminRegistrations(isDemo);

  if (format === "csv") {
    const headers = [
      "ID",
      "Created At",
      "Name",
      "Email",
      "College",
      "Branch",
      "Year",
      "Referral Code",
      "Referred By Code",
      "Source",
      "Status",
      "Void Reason",
      "Is Demo",
    ];

    const rows = registrations.map((r) => [
      `"${r.id}"`,
      `"${r.created_at}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email_lower}"`,
      `"${(r.college_name || "").replace(/"/g, '""')}"`,
      `"${r.branch.replace(/"/g, '""')}"`,
      `"${r.grad_year}"`,
      `"${r.referral_code}"`,
      `"${r.referred_by_code || ""}"`,
      `"${r.utm_source || ""}"`,
      `"${r.status}"`,
      `"${(r.void_reason || "").replace(/"/g, '""')}"`,
      r.is_demo ? "true" : "false",
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="squad_race_registrations_${isDemo ? "demo" : "live"}.csv"`,
      },
    });
  }

  return NextResponse.json({
    success: true,
    isDemo,
    count: registrations.length,
    registrations,
  });
}

export async function POST(req: NextRequest) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, registrationId, reason } = body;

    if (!registrationId) {
      return NextResponse.json({ success: false, message: "registrationId is required" }, { status: 400 });
    }

    if (action === "void") {
      const ok = SquadRaceDB.voidRegistration(registrationId, reason || "Admin manual void");
      if (!ok) return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Registration marked void" });
    }

    if (action === "restore") {
      const ok = SquadRaceDB.restoreRegistration(registrationId);
      if (!ok) return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Registration restored" });
    }

    return NextResponse.json({ success: false, message: "Invalid action. Use 'void' or 'restore'." }, { status: 400 });
  } catch (err: unknown) {
    console.error("Admin action error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
