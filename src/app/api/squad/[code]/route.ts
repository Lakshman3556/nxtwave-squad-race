import { NextRequest, NextResponse } from "next/server";
import { SquadRaceDB } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    if (!code) {
      return NextResponse.json({ success: false, message: "Code required" }, { status: 400 });
    }

    const reg = SquadRaceDB.getRegistrationByCode(code);
    if (!reg) {
      return NextResponse.json({ success: false, message: "Squad card not found" }, { status: 404 });
    }

    const referralCount = SquadRaceDB.getReferralCount(code, reg.is_demo);
    const leaderboard = SquadRaceDB.getLeaderboard(reg.is_demo);

    // Find college ranking
    const collegeItem = leaderboard.colleges.find((c) => c.college_id === reg.college_id);
    const collegeRank = collegeItem ? collegeItem.rank : leaderboard.colleges.length + 1;
    const collegeTotal = collegeItem ? collegeItem.count : 1;

    // Find friends who registered through this squad link (privacy: first name and branch only)
    const dbData = SquadRaceDB.getAdminRegistrations(reg.is_demo);
    const friends = dbData
      .filter((r) => r.referred_by_code === reg.referral_code && r.status !== "void")
      .map((r) => ({
        first_name: r.name.split(" ")[0] || "Friend",
        branch: r.branch.split(" (")[0] || r.branch,
        created_at: r.created_at,
      }));

    return NextResponse.json({
      success: true,
      data: {
        name: reg.name,
        referral_code: reg.referral_code,
        college_id: reg.college_id,
        college_name: reg.college_name,
        branch: reg.branch,
        grad_year: reg.grad_year,
        referrals_count: referralCount,
        college_rank: collegeRank,
        college_total: collegeTotal,
        friends,
        rewards: {
          starter_kit_unlocked: referralCount >= 3,
          starter_kit_needed: Math.max(0, 3 - referralCount),
          champion_unlocked: referralCount >= 10,
          champion_needed: Math.max(0, 10 - referralCount),
        },
      },
    });
  } catch (err: unknown) {
    console.error("Squad fetch error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
