import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { spawn, ChildProcess } from "child_process";

const SCREENSHOT_DIR = path.join(process.cwd(), "docs", "screenshots");
const OUTPUT_PDF = path.join(process.cwd(), "docs", "Growth_Plan.pdf");

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureServerRunning(port: number = 3000): Promise<{ process?: ChildProcess }> {
  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    if (res.ok) {
      console.log(`Server already running on port ${port}.`);
      return {};
    }
  } catch {}

  console.log(`Starting Next.js server on port ${port}...`);
  const server = spawn("npm.cmd", ["run", "start", "--", "-p", String(port)], {
    cwd: process.cwd(),
    stdio: "pipe",
    shell: true,
  });

  server.stdout?.on("data", (data) => console.log(`[Next] ${data}`));
  server.stderr?.on("data", (data) => console.error(`[Next Err] ${data}`));

  // Wait for server to become responsive
  for (let i = 0; i < 30; i++) {
    await wait(1000);
    try {
      const res = await fetch(`http://localhost:${port}/api/health`);
      if (res.ok) {
        console.log(`Server ready on port ${port}!`);
        return { process: server };
      }
    } catch {}
  }

  throw new Error("Server failed to start on time.");
}

async function generatePlanPdf() {
  console.log("🚀 Starting 16:9 Growth Plan PDF generation with Playwright...");

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const { process: serverProc } = await ensureServerRunning(3000);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log("📸 Capturing real UI screenshots from live application...");

  // 1. Landing Page
  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(1000);
  const shotLanding = path.join(SCREENSHOT_DIR, "screen_landing.png");
  await page.screenshot({ path: shotLanding });

  // 2. Leaderboard
  await page.goto("http://localhost:3000/race");
  await page.waitForTimeout(1000);
  const shotLeaderboard = path.join(SCREENSHOT_DIR, "screen_leaderboard.png");
  await page.screenshot({ path: shotLeaderboard });

  // 3. Growth Dashboard
  await page.goto("http://localhost:3000/growth");
  await page.waitForTimeout(1000);
  const shotDashboard = path.join(SCREENSHOT_DIR, "screen_dashboard.png");
  await page.screenshot({ path: shotDashboard });

  // 4. Simulator
  await page.goto("http://localhost:3000/plan");
  await page.waitForTimeout(1000);
  const shotSimulator = path.join(SCREENSHOT_DIR, "screen_simulator.png");
  await page.screenshot({ path: shotSimulator });

  // Convert screenshot files to base64 so HTML embeds without external dependencies
  const b64Landing = `data:image/png;base64,${fs.readFileSync(shotLanding).toString("base64")}`;
  const b64Leaderboard = `data:image/png;base64,${fs.readFileSync(shotLeaderboard).toString("base64")}`;
  const b64Dashboard = `data:image/png;base64,${fs.readFileSync(shotDashboard).toString("base64")}`;
  const b64Simulator = `data:image/png;base64,${fs.readFileSync(shotSimulator).toString("base64")}`;

  console.log("🎨 Assembling 5-Slide 16:9 presentation HTML...");

  const slidesHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Growth Plan - NxtWave Squad Race</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #020617;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    
    .slide {
      width: 1280px;
      height: 720px;
      page-break-after: always;
      position: relative;
      background: radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.08), transparent 45%),
                  radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.06), transparent 50%),
                  #020617;
      padding: 56px 64px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border-bottom: 1px solid #1e293b;
    }

    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-size: 13px;
      font-weight: 700;
      border-radius: 999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .slide-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #64748b;
      font-weight: 700;
    }

    .slide-title {
      font-size: 38px;
      font-weight: 900;
      line-height: 1.15;
      color: #ffffff;
      letter-spacing: -0.8px;
      margin-bottom: 12px;
    }
    .slide-subtitle {
      font-size: 16px;
      color: #94a3b8;
      font-weight: 500;
      line-height: 1.5;
    }

    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 16px;
    }

    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #1e293b;
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }

    /* Cards & Grids */
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .grid-2 { display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; }

    .card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(51, 65, 85, 0.8);
      border-radius: 20px;
      padding: 24px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 800;
      color: #f8fafc;
      margin-bottom: 8px;
    }
    .card-text {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
    }

    .stat-val {
      font-size: 38px;
      font-weight: 900;
      font-family: 'JetBrains Mono', monospace;
      color: #10b981;
    }
    .stat-sub {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }

    .pill-tag {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #f59e0b;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-block;
      margin-top: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      color: #cbd5e1;
    }
    th {
      text-align: left;
      padding: 8px 12px;
      border-bottom: 1px solid #334155;
      color: #94a3b8;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.4);
      font-family: 'JetBrains Mono', monospace;
    }

    .screen-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .screen-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .screen-img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-bottom: 1px solid #1e293b;
    }
    .screen-desc {
      padding: 10px;
      font-size: 11px;
      font-weight: 700;
      color: #e2e8f0;
      text-align: center;
    }

    .test-box {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 14px 18px;
      margin-top: 16px;
      font-size: 12px;
      line-height: 1.5;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1 -->
  <div class="slide">
    <div class="slide-header">
      <div class="badge">NxtWave Growth Challenge • 2027 Cohort</div>
      <div class="slide-num">01 / 05</div>
    </div>
    <div>
      <h1 class="slide-title">Final-years do not need another webinar.<br>They need a project to show.</h1>
      <p class="slide-subtitle">Who: 2027-batch engineering students at Tier-2/3/4 colleges (all branches).</p>
    </div>
    <div class="slide-body">
      <div class="grid-4">
        <div class="card">
          <div class="card-title">1. Placement Proof</div>
          <div class="card-text">"Every interviewer asks what I have built with AI. I have only generic mini-projects."</div>
          <div class="pill-tag">Core Driver</div>
        </div>
        <div class="card">
          <div class="card-title">2. Clock Urgency</div>
          <div class="card-text">"My final-year capstone is due, and 60 minutes is something I can commit to during drive season."</div>
          <div class="pill-tag">Low Friction</div>
        </div>
        <div class="card">
          <div class="card-title">3. Collegiate Tribalism</div>
          <div class="card-text">"If my classmates and campus are joining, I will not be the one left behind."</div>
          <div class="pill-tag">Social Proof</div>
        </div>
        <div class="card" style="border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.05);">
          <div class="card-title" style="color: #34d399;">Registration Engine</div>
          <div class="card-text">Outcome hook, zero phone numbers, 20-second form, and immediate 'first project idea' reward.</div>
          <div class="pill-tag" style="background: rgba(16,185,129,0.2); color:#34d399; border-color: rgba(16,185,129,0.4);">
            Squad Race
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>Candidate: Lakshman (B.E. IT, Hyderabad)</span>
      <span>All conversion rates are assumptions to validate</span>
      <span>Target: 500 Registrations • ₹2,000 Budget • 7 Days</span>
    </div>
  </div>

  <!-- SLIDE 2 -->
  <div class="slide">
    <div class="slide-header">
      <div class="badge">Channel Architecture</div>
      <div class="slide-num">02 / 05</div>
    </div>
    <div>
      <h1 class="slide-title">500 students will not come from ads.<br>They come from people they trust.</h1>
      <p class="slide-subtitle">The arithmetic: ₹2,000 at ₹30–₹80 CPR buys ~35 signups. Trusted humans seed; Squad Race multiplies.</p>
    </div>
    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 20px;">
        <div class="card">
          <div style="font-size: 11px; color:#10b981; font-weight:800; text-transform:uppercase;">Rank 1 • WhatsApp</div>
          <div class="card-title" style="margin-top:4px;">Campus Champions</div>
          <div class="stat-val" style="font-size: 28px;">~190</div>
          <div class="card-text" style="font-size: 12px; margin-top:4px;">20 student reps post AI-written branch kits into native class groups.</div>
        </div>
        <div class="card">
          <div style="font-size: 11px; color:#6366f1; font-weight:800; text-transform:uppercase;">Rank 2 • Email</div>
          <div class="card-title" style="margin-top:4px;">Placement Cells</div>
          <div class="stat-val" style="font-size: 28px; color:#818cf8;">~100</div>
          <div class="card-text" style="font-size: 12px; margin-top:4px;">300 personalized emails to TPOs & HoDs; official circulars carry authority.</div>
        </div>
        <div class="card">
          <div style="font-size: 11px; color:#14b8a6; font-weight:800; text-transform:uppercase;">Rank 3 • Clubs</div>
          <div class="card-title" style="margin-top:4px;">Tech Communities</div>
          <div class="stat-val" style="font-size: 28px; color:#2dd4bf;">~60</div>
          <div class="card-text" style="font-size: 12px; margin-top:4px;">GDG on Campus, IEEE, and AI clubs co-post with inter-club challenge.</div>
        </div>
        <div class="card">
          <div style="font-size: 11px; color:#f59e0b; font-weight:800; text-transform:uppercase;">Rank 4 • Paid Test</div>
          <div class="card-title" style="margin-top:4px;">A/B Hook Test</div>
          <div class="stat-val" style="font-size: 28px; color:#fbbf24;">~30</div>
          <div class="card-text" style="font-size: 12px; margin-top:4px;">₹600 split across 2 variants to buy learning on winning message.</div>
        </div>
      </div>
      <div class="card" style="padding: 14px 20px;">
        <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform:uppercase; margin-bottom: 6px;">7-Day Execution Timeline</div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #cbd5e1; font-weight: 600;">
          <span><strong>D1:</strong> Asset live, Brief champions</span>
          <span><strong>D2:</strong> TPO email batch 2, Test 1 signals</span>
          <span><strong>D3:</strong> Leaderboard battle shared</span>
          <span><strong style="color:#f59e0b;">D4 Gate:</strong> Scale winner</span>
          <span><strong>D5:</strong> Branch wave (ECE/Mech)</span>
          <span><strong>D6:</strong> Honest deadline</span>
          <span><strong>D7:</strong> Cohort build</span>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>Unit Economics: 380 Direct Seeds + 120 Viral Referrals = 500 Total</span>
      <span>Budget: ₹1,000 Vouchers • ₹600 Ad Test • ₹400 Reserve</span>
    </div>
  </div>

  <!-- SLIDE 3 -->
  <div class="slide">
    <div class="slide-header">
      <div class="badge">Funnel Math & Risk Gate</div>
      <div class="slide-num">03 / 05</div>
    </div>
    <div>
      <h1 class="slide-title">How 500 happens: 380 seeds<br>plus a 0.24 referral loop.</h1>
      <p class="slide-subtitle">Total = Seed / (1 - k) = 380 / (1 - 0.24) = 500. Every single rate is an assumption to validate.</p>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="font-size:14px; margin-bottom: 12px;">Scenario Sensitivity Matrix</div>
          <table>
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Seed</th>
                <th>k-Loop</th>
                <th>Total</th>
                <th>Strategy / Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style="color: #34d399; font-weight: 700;">
                <td>Plan (Base)</td>
                <td>380</td>
                <td>0.24</td>
                <td>500</td>
                <td style="font-family: inherit;">Stay course, monitor D4 gate.</td>
              </tr>
              <tr>
                <td>Referral weak</td>
                <td>380</td>
                <td>0.10</td>
                <td>422</td>
                <td style="font-family: inherit;">Boost prompts; add D5 college bonus.</td>
              </tr>
              <tr>
                <td>Seeding weak (-20%)</td>
                <td>304</td>
                <td>0.24</td>
                <td>400</td>
                <td style="font-family: inherit;">Day-4 rescue: second club push.</td>
              </tr>
              <tr style="color: #f87171;">
                <td>Both weak</td>
                <td>304</td>
                <td>0.10</td>
                <td>338</td>
                <td style="font-family: inherit;">Honest shortfall: focus top 5 colleges.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="display:flex; flex-direction:column; gap: 14px;">
          <div class="card" style="padding: 18px;">
            <div style="font-size: 11px; text-transform: uppercase; color: #f59e0b; font-weight: 800;">Day-4 Pacing Gate Rule</div>
            <div style="font-size: 13px; color: #e2e8f0; margin-top: 4px; line-height: 1.4;">
              If cumulative registrations &lt; 250 by Day 4: trigger rescue levers and deploy ₹400 reserve. If &gt; 290: protect plan and keep reserve unspent.
            </div>
          </div>
          <div class="card" style="padding: 18px;">
            <div style="font-size: 11px; text-transform: uppercase; color: #10b981; font-weight: 800;">Budget Split (₹2,000 Total)</div>
            <div style="font-size: 13px; color: #e2e8f0; margin-top: 4px; line-height: 1.4;">
              • ₹1,000: Top 3 referrers (₹500 / ₹300 / ₹200) awarded after attendance.<br>
              • ₹600: Paid hook A/B test (Test 1).<br>
              • ₹400: Gated rescue reserve.
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>Daily Pacing: D1: 60 • D2: 130 • D3: 210 • D4: 290 • D5: 370 • D6: 440 • D7: 500</span>
      <span>Parametric Growth Model</span>
    </div>
  </div>

  <!-- SLIDE 4 -->
  <div class="slide">
    <div class="slide-header">
      <div class="badge">Working Asset & 3 Tests</div>
      <div class="slide-num">04 / 05</div>
    </div>
    <div>
      <h1 class="slide-title">I built the engine that makes it happen:<br>Squad Race (live).</h1>
      <p class="slide-subtitle">Live web app deployed on Vercel with server route handlers, fraud filters, and instant WhatsApp attribution.</p>
    </div>
    <div class="slide-body">
      <div class="screen-grid">
        <div class="screen-card">
          <img class="screen-img" src="${b64Landing}" alt="Landing & Form" />
          <div class="screen-desc">1. 20-Sec Registration</div>
        </div>
        <div class="screen-card">
          <img class="screen-img" src="${b64Leaderboard}" alt="Leaderboard" />
          <div class="screen-desc">2. College Leaderboard</div>
        </div>
        <div class="screen-card">
          <img class="screen-img" src="${b64Dashboard}" alt="Growth Dashboard" />
          <div class="screen-desc">3. Growth Dashboard</div>
        </div>
        <div class="screen-card">
          <img class="screen-img" src="${b64Simulator}" alt="Simulator" />
          <div class="screen-desc">4. 'Path to 500' Simulator</div>
        </div>
      </div>

      <div class="test-box">
        <div style="font-weight: 800; color: #34d399; margin-bottom: 4px; font-size: 11px; text-transform:uppercase;">The 3 Experimental Tests Built-in:</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 11px;">
          <div><strong>Test 1 (Hook):</strong> Placement-proof vs. Curiosity on 8 class groups + ₹600 ad test. Metric: link-to-reg conversion (≥20% lift wins).</div>
          <div><strong>Test 2 (Social):</strong> College race rank vs. individual rank card. Metric: 24h WhatsApp share rate and k-factor (≥25% lift keeps race).</div>
          <div><strong>Test 3 (Trust):</strong> Peer Champion vs. Placement vs. Club via utm_source. Metric: regs per 100 reached (≥1.5x shifts reserve).</div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>Public Asset: https://nxtwave-squad-race.vercel.app</span>
      <span>Admin Key: nxtwave_growth_2027</span>
      <span>Database: Supabase / Resilient Embedded Relational</span>
    </div>
  </div>

  <!-- SLIDE 5 -->
  <div class="slide">
    <div class="slide-header">
      <div class="badge">Reflection & Next Horizon</div>
      <div class="slide-num">05 / 05</div>
    </div>
    <div>
      <h1 class="slide-title">How I thought.</h1>
      <p class="slide-subtitle">Judgement over tooling: real decisions, deliberate rejections, and post-campaign completion leaks.</p>
    </div>
    <div class="slide-body">
      <div class="grid-3">
        <div class="card">
          <div class="card-title">What Changed from First Idea</div>
          <div class="card-text" style="font-size: 12px;">
            I started with a classic landing page + Meta ads. The unit arithmetic (₹2,000 buys only 25–65 signups) and public NxtWave workshop reports flipped my plan to trusted human seeding plus a collegiate referral race—turning the asset into the engine.
          </div>
        </div>

        <div class="card">
          <div class="card-title">What I Rejected from AI</div>
          <div class="card-text" style="font-size: 12px;">
            • Paid influencer shoutouts (untargeted, bad unit economics).<br>
            • Bulk contact scraping (spam, WhatsApp bans, privacy).<br>
            • Fake scarcity counters ("only 37 seats left" destroys trust).<br>
            • Cash per referral (invites fraud and breaks budget).
          </div>
        </div>

        <div class="card" style="border-color: rgba(99, 102, 241, 0.4);">
          <div class="card-title" style="color: #818cf8;">With Another 24 Hours</div>
          <div class="card-text" style="font-size: 12px;">
            Public reports from a past college workshop showed <strong>1,139 attended but only 42 submitted projects</strong>. Registration is only step 1; project completion is the real leak. I would build a live AI project rubric evaluator giving instant feedback.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>Real Success Metric: Workshop Attendance & Working Project Submissions</span>
      <span>End of Presentation • 5 of 5 Slides</span>
    </div>
  </div>

</body>
</html>
  `;

  await page.setContent(slidesHtml, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  console.log("📄 Rendering exact 16:9 PDF...");
  await page.pdf({
    path: OUTPUT_PDF,
    width: "1280px",
    height: "720px",
    printBackground: true,
    margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    pageRanges: "1-5",
  });

  await browser.close();

  if (serverProc) {
    serverProc.kill();
  }

  console.log(`✅ Growth Plan PDF successfully created at: ${OUTPUT_PDF}`);
  console.log(`   Dimensions: 1280x720 (16:9 ratio)`);
  console.log(`   Page count: strictly 5 slides`);
}

generatePlanPdf().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
