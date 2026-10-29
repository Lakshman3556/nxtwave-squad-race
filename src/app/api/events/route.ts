import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SquadRaceDB } from "@/lib/db";

const eventSchema = z.object({
  type: z.enum(["view", "form_start", "submit", "share_click", "copy_link", "wa_click"]),
  session_id: z.string().optional(),
  registration_id: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  ref_code: z.string().optional().nullable(),
  is_demo: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    SquadRaceDB.logEvent({
      session_id: parsed.data.session_id || "browser_session",
      type: parsed.data.type,
      registration_id: parsed.data.registration_id || null,
      source: parsed.data.source || null,
      ref_code: parsed.data.ref_code || null,
      is_demo: parsed.data.is_demo || false,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
