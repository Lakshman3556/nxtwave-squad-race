import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SquadRaceDB } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please provide a valid college or personal email address"),
  college_id: z.string().min(1, "Please select your college"),
  college_other: z.string().optional().nullable(),
  branch: z.string().min(1, "Please select your engineering branch"),
  grad_year: z.string().min(1, "Please select your graduation year"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive workshop updates",
  }),
  ref_code: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: "Please check form entries",
        },
        { status: 400 }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { registration, isExisting } = SquadRaceDB.registerStudent(
      {
        name: parsed.data.name,
        email: parsed.data.email,
        college_id: parsed.data.college_id,
        college_other: parsed.data.college_other || undefined,
        branch: parsed.data.branch,
        grad_year: parsed.data.grad_year,
        consent: parsed.data.consent,
        ref_code: parsed.data.ref_code || undefined,
        utm_source: parsed.data.utm_source || undefined,
        utm_medium: parsed.data.utm_medium || undefined,
        utm_campaign: parsed.data.utm_campaign || undefined,
      },
      clientIp,
      false // Real live registration
    );

    return NextResponse.json({
      success: true,
      isExisting,
      registration: {
        id: registration.id,
        name: registration.name,
        referral_code: registration.referral_code,
        college_id: registration.college_id,
        college_name: registration.college_name,
        branch: registration.branch,
        grad_year: registration.grad_year,
        status: registration.status,
      },
    });
  } catch (err: unknown) {
    console.error("Registration error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
