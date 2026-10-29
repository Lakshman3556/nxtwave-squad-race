import fs from "fs";
import path from "path";
import crypto from "crypto";
import { COLLEGE_LIST, BRANCHES } from "../src/content";
import { College, Registration, AnalyticsEvent } from "../src/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const FIRST_NAMES = [
  "Aarav", "Ananya", "Rohit", "Sneha", "Rahul", "Pooja", "Vikram", "Neha",
  "Karthik", "Divya", "Siddharth", "Priya", "Aditya", "Riya", "Varun", "Meera",
  "Sai", "Teja", "Harshitha", "Nikhil", "Shreya", "Pranav", "Bhavya", "Akash",
  "Tanvi", "Suresh", "Keerthi", "Manish", "Swathi", "Gautam", "Anjali", "Sanjay",
  "Kavya", "Arjun", "Deepika", "Manoj", "Aishwarya", "Vishal", "Ramya", "Charan",
  "Lavanya", "Tarun", "Sravani", "Ravi", "Mounika", "Kiran", "Pavani", "Abhishek",
  "Sowmya", "Vinay", "Sindhu", "Mahesh", "Pranathi", "Dinesh", "Sahithi", "Santosh"
];

const LAST_NAMES = [
  "Reddy", "Sharma", "Rao", "Kumar", "Verma", "Patel", "Gupta", "Nair",
  "Iyer", "Choudhury", "Bose", "Mehta", "Singh", "Das", "Joshi", "Menon",
  "Venkatesh", "Naidu", "Chowdary", "Varma", "Goud", "Prasad", "Swamy"
];

const REFERRAL_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomReferralCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += REFERRAL_ALPHABET[Math.floor(Math.random() * REFERRAL_ALPHABET.length)];
  }
  return code;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function runSeed() {
  console.log("🌱 Starting realistic demo dataset seeding for Squad Race...");

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const initialColleges: College[] = COLLEGE_LIST.map((c) => ({
    id: c.id,
    name: c.name,
    city: c.city,
    state: c.state,
    name_norm: c.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
  }));

  // Clean existing demo data if any, preserve non-demo
  let existingRegistrations: Registration[] = [];
  let existingEvents: AnalyticsEvent[] = [];

  if (fs.existsSync(DB_FILE)) {
    try {
      const current = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      existingRegistrations = (current.registrations || []).filter((r: Registration) => !r.is_demo);
      existingEvents = (current.events || []).filter((e: AnalyticsEvent) => !e.is_demo);
    } catch {
      // Start fresh
    }
  }

  const demoRegistrations: Registration[] = [];
  const demoEvents: AnalyticsEvent[] = [];
  const usedCodes = new Set<string>();

  // Target 500 registrations across 7 simulated days matching pacing:
  // D1: 60, D2: 70 (cum 130), D3: 80 (cum 210), D4: 80 (cum 290), D5: 80 (cum 370), D6: 70 (cum 440), D7: 60 (cum 500)
  const dayDistribution = [60, 70, 80, 80, 80, 70, 60];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // We want channel distribution:
  // Champions: ~190, Placement: ~100, Clubs: ~60, Social/Paid: ~30, Referrals: ~120
  // Total ~500

  const allSeedChampions: string[] = [];

  let currentCount = 0;
  for (let dayIdx = 0; dayIdx < dayDistribution.length; dayIdx++) {
    const day = dayIdx + 1;
    const targetThisDay = dayDistribution[dayIdx];
    const dayStartTime = now - (7 - day) * dayMs;

    for (let i = 0; i < targetThisDay; i++) {
      currentCount++;
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${currentCount}${Math.floor(Math.random() * 899 + 100)}@college.edu.in`;

      let code = randomReferralCode();
      while (usedCodes.has(code)) {
        code = randomReferralCode();
      }
      usedCodes.add(code);

      // Select channel source according to realistic weighting
      let source = "whatsapp_champion";
      let referredBy: string | null = null;
      const roll = Math.random();

      if (roll < 0.24 && allSeedChampions.length > 5) {
        // Referral loop (~24% = ~120)
        source = "referral";
        referredBy = randomItem(allSeedChampions.slice(0, 40));
      } else if (roll < 0.62) {
        // Champions (~38% = ~190)
        source = "whatsapp_champion";
      } else if (roll < 0.82) {
        // Placement cell emails (~20% = ~100)
        source = "placement_email";
      } else if (roll < 0.94) {
        // Student Clubs (~12% = ~60)
        source = "student_clubs";
      } else {
        // Social & Paid Test (~6% = ~30)
        source = "social_paid_test";
      }

      // Add to champion pool for referrals
      if (allSeedChampions.length < 50 || Math.random() < 0.15) {
        allSeedChampions.push(code);
      }

      // College weighting: higher weight for top Hyderabad/AP colleges
      const weightedColleges = [
        "cbit", "cbit", "cbit",
        "vnr-vjiet", "vnr-vjiet",
        "vasavi", "vasavi",
        "griet", "griet",
        "jntuh", "jntuh",
        "osmania", "osmania",
        "cvr", "vardhaman", "snist", "bvrit", "anurag", "kits-warangal",
        "nit-warangal", "iiit-hyderabad", "andhra-uni", "gvpce", "rvr-jc", "kl-uni",
        "vignan", "srm-ap", "vit-ap"
      ];
      const collegeId = randomItem(weightedColleges);
      const branch = randomItem(BRANCHES);

      // Small sample of fraudulent / void entries (about 12 out of 500)
      let status: "verified" | "provisional" | "void" = "verified";
      let voidReason: string | null = null;

      if (currentCount % 42 === 0) {
        status = "void";
        voidReason = "Disposable domain provider flagged (mailinator.com)";
      } else if (currentCount % 77 === 0) {
        status = "void";
        voidReason = "Admin flagged: repeated identical registration pattern";
      } else if (currentCount % 12 === 0) {
        status = "provisional";
      }

      const createdTime = new Date(dayStartTime + Math.floor(Math.random() * dayMs)).toISOString();

      const reg: Registration = {
        id: crypto.randomUUID(),
        created_at: createdTime,
        name: fullName,
        email_lower: email.toLowerCase(),
        college_id: collegeId,
        college_other: null,
        branch,
        grad_year: "2027",
        referral_code: code,
        referred_by_code: referredBy,
        utm_source: source,
        utm_medium: source === "referral" ? "squad_link" : "whatsapp",
        utm_campaign: "ai_workshop_squad_race",
        ip_hash: crypto.createHash("sha256").update(email).digest("hex").slice(0, 16),
        status,
        void_reason: voidReason,
        consent: true,
        is_demo: true,
      };

      demoRegistrations.push(reg);

      // Add analytics events
      demoEvents.push({
        id: crypto.randomUUID(),
        created_at: createdTime,
        session_id: crypto.randomUUID(),
        type: "submit",
        registration_id: reg.id,
        source: source,
        ref_code: referredBy,
        is_demo: true,
      });

      // 40% of registrants clicked WhatsApp share
      if (Math.random() < 0.40) {
        demoEvents.push({
          id: crypto.randomUUID(),
          created_at: createdTime,
          session_id: crypto.randomUUID(),
          type: "wa_click",
          registration_id: reg.id,
          source: "squad_card",
          ref_code: reg.referral_code,
          is_demo: true,
        });
      }
    }
  }

  // Synthesize realistic view and form_start funnel events
  for (let i = 0; i < 1550; i++) {
    demoEvents.push({
      id: crypto.randomUUID(),
      created_at: new Date(now - Math.random() * 7 * dayMs).toISOString(),
      session_id: crypto.randomUUID(),
      type: "view",
      source: "whatsapp",
      is_demo: true,
    });
  }

  for (let i = 0; i < 840; i++) {
    demoEvents.push({
      id: crypto.randomUUID(),
      created_at: new Date(now - Math.random() * 7 * dayMs).toISOString(),
      session_id: crypto.randomUUID(),
      type: "form_start",
      source: "whatsapp",
      is_demo: true,
    });
  }

  const completeDatabase = {
    colleges: initialColleges,
    registrations: [...existingRegistrations, ...demoRegistrations],
    events: [...existingEvents, ...demoEvents],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(completeDatabase, null, 2), "utf-8");

  const nonVoidCount = demoRegistrations.filter((r) => r.status !== "void").length;
  const voidCount = demoRegistrations.filter((r) => r.status === "void").length;
  console.log(`✅ Demo seeding complete:`);
  console.log(`   Total simulated registrations: ${demoRegistrations.length}`);
  console.log(`   Active non-void registrations: ${nonVoidCount}`);
  console.log(`   Void / Fraud flag test entries: ${voidCount}`);
  console.log(`   Colleges represented: ${new Set(demoRegistrations.map((r) => r.college_id)).size}`);
  console.log(`   Funnel events generated: ${demoEvents.length}`);
}

runSeed();
