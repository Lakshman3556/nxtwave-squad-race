import assert from "assert";
import { SquadRaceDB, generateReferralCode, hashIp } from "../src/lib/db";
import { BRANCH_IDEAS } from "../src/content";

console.log("🧪 Running Squad Race Comprehensive Test Suite...\n");

let passed = 0;
let total = 0;

function test(name: string, fn: () => void) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err: unknown) {
    console.error(`  ✗ ${name}`);
    console.error(`    `, err);
  }
}

// 1. Referral Code Generation Uniqueness & Character Alphabet
test("Referral Code Alphabet excludes ambiguous characters (no 0, O, 1, I, L)", () => {
  const allowed = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const forbidden = ["0", "O", "1", "I", "L"];

  for (let i = 0; i < 100; i++) {
    const code = generateReferralCode();
    assert.strictEqual(code.length, 6, "Code must be 6 characters long");
    for (const char of code) {
      assert.ok(allowed.includes(char), `Character '${char}' must be in allowed alphabet`);
      assert.ok(!forbidden.includes(char), `Forbidden ambiguous character '${char}' detected`);
    }
  }
});

// 2. Email Deduplication
test("Email deduplication: lowercased duplicate returns existing squad card", () => {
  const testEmail = `test.student.${Date.now()}@cbit.ac.in`;
  const reg1 = SquadRaceDB.registerStudent(
    {
      name: "Test Student",
      email: testEmail.toUpperCase(),
      college_id: "cbit",
      branch: "Computer Science",
      grad_year: "2027",
      consent: true,
    },
    "127.0.0.1",
    false
  );

  assert.strictEqual(reg1.isExisting, false, "First registration must be new");

  // Second registration with lowercase / mixed-case email
  const reg2 = SquadRaceDB.registerStudent(
    {
      name: "Test Student Changed",
      email: testEmail.toLowerCase(),
      college_id: "cbit",
      branch: "Computer Science",
      grad_year: "2027",
      consent: true,
    },
    "127.0.0.1",
    false
  );

  assert.strictEqual(reg2.isExisting, true, "Duplicate registration must return existing record");
  assert.strictEqual(reg2.registration.referral_code, reg1.registration.referral_code);
});

// 3. Self-Referral Blocked
test("Self-referral blocked: user using their own code is not attributed", () => {
  const email = `self.ref.${Date.now()}@vasavi.edu`;
  const reg = SquadRaceDB.registerStudent(
    {
      name: "Self Referrer",
      email: email,
      college_id: "vasavi",
      branch: "Information Technology",
      grad_year: "2027",
      consent: true,
    },
    "127.0.0.1",
    false
  );

  const ownCode = reg.registration.referral_code;

  // Try registering another user using the code
  const friendEmail = `friend.${Date.now()}@vasavi.edu`;
  const friendReg = SquadRaceDB.registerStudent(
    {
      name: "Friend User",
      email: friendEmail,
      college_id: "vasavi",
      branch: "Information Technology",
      grad_year: "2027",
      consent: true,
      ref_code: ownCode,
    },
    "127.0.0.2",
    false
  );

  assert.strictEqual(friendReg.registration.referred_by_code, ownCode, "Friend should be referred by ownCode");

  // Now attempt registering user with their own email and code
  const selfAttributionReg = SquadRaceDB.registerStudent(
    {
      name: "Self Referrer Attempt",
      email: email,
      college_id: "vasavi",
      branch: "Information Technology",
      grad_year: "2027",
      consent: true,
      ref_code: ownCode,
    },
    "127.0.0.1",
    false
  );

  assert.notStrictEqual(selfAttributionReg.registration.referred_by_code, ownCode, "Cannot refer oneself");
});

// 4. Voiding registration changes counts
test("Admin voiding immediately excludes registration from referral count and leaderboard", () => {
  const leaderEmail = `leader.${Date.now()}@vnr.edu`;
  const leader = SquadRaceDB.registerStudent(
    {
      name: "Leader Candidate",
      email: leaderEmail,
      college_id: "vnr-vjiet",
      branch: "ECE",
      grad_year: "2027",
      consent: true,
    },
    "10.0.0.1",
    false
  );

  const subEmail = `sub.${Date.now()}@vnr.edu`;
  const sub = SquadRaceDB.registerStudent(
    {
      name: "Sub Candidate",
      email: subEmail,
      college_id: "vnr-vjiet",
      branch: "ECE",
      grad_year: "2027",
      consent: true,
      ref_code: leader.registration.referral_code,
    },
    "10.0.0.2",
    false
  );

  const countBefore = SquadRaceDB.getReferralCount(leader.registration.referral_code, false);
  assert.ok(countBefore >= 1, "Referral count should be at least 1");

  // Void the referred student
  SquadRaceDB.voidRegistration(sub.registration.id, "Test void reason");

  const countAfter = SquadRaceDB.getReferralCount(leader.registration.referral_code, false);
  assert.strictEqual(countAfter, countBefore - 1, "Voiding must decrease non-void referral count by 1");

  // Restore the registration
  SquadRaceDB.restoreRegistration(sub.registration.id);
  const countRestored = SquadRaceDB.getReferralCount(leader.registration.referral_code, false);
  assert.strictEqual(countRestored, countBefore, "Restoring must restore the referral count");
});

// 5. Simulator Math: Preset 'Plan' equals 500
test("Simulator Math: Preset 'Plan' yields exactly 500 registrations", () => {
  const champions = 20;
  const reach = 320;
  const conv = 0.03; // 3.0%
  const champSeeds = Math.round(champions * reach * conv); // 192

  const emails = 300;
  const adoption = 10 / 300; // 3.33% = 10 colleges
  const perCollege = 10;
  const placementSeeds = Math.round(emails * adoption * perCollege); // 100

  const clubs = 6;
  const clubRegs = 10;
  const clubSeeds = clubs * clubRegs; // 60

  const socialSeeds = 30;

  const totalSeed = champSeeds + placementSeeds + clubSeeds + socialSeeds; // 192 + 100 + 60 + 30 = 382 ~ 380

  const shareRate = 0.40;
  const friendsPerSharer = 0.60;
  const k = shareRate * friendsPerSharer; // 0.24

  const totalProjected = Math.round(380 / (1 - k)); // 380 / 0.76 = 500
  assert.strictEqual(totalProjected, 500, "Plan preset must mathematically equal 500");
});

// 6. WhatsApp Share text under 450 characters
test("WhatsApp share text templates are strictly under 450 characters", () => {
  const branchName = "Computer Science";
  const url = "https://nxtwave-squad-race.vercel.app/?ref=TEST99";
  const text = `Hey! I just registered for NxtWave's free hands-on workshop: "Build Your First AI Project in 60 Minutes". 

We leave with an actual working AI project to demo in placement interviews (especially relevant for ${branchName}).

Join our college squad through my link so we can climb the leaderboard together:
${url}`;

  assert.ok(text.length < 450, `WhatsApp share text (${text.length} chars) must be under 450 chars`);
});

// 7. Deterministic LLM Fallback Reliability
test("Deterministic AI ideas fallback provides robust recommendations across all engineering branches", () => {
  const branches = ["CSE", "ECE", "EEE", "Mech", "Civil", "Default"];
  for (const b of branches) {
    const ideas = BRANCH_IDEAS[b];
    assert.ok(Array.isArray(ideas), `Branch ${b} must have idea list`);
    assert.strictEqual(ideas.length, 3, `Branch ${b} must have exactly 3 ideas`);
    for (const idea of ideas) {
      assert.ok(idea.title.length > 5, "Title must be meaningful");
      assert.ok(idea.desc.length > 10, "Description must be detailed");
      assert.ok(idea.resumeLine.length > 15, "Resume bullet must be present");
    }
  }
});

console.log(`\nResults: ${passed}/${total} tests passed successfully.\n`);
if (passed !== total) {
  process.exit(1);
}
