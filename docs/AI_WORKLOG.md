# AI Worklog: NxtWave Growth Challenge Submission
**Candidate:** Lakshman (Final-Year B.E. IT Student, Hyderabad)  
**Project:** Squad Race — Referral Engine & Growth Strategy for 'Build Your First AI Project in 60 Minutes'  
**Submission Window:** 48 Hours | Target: 500 Registrations with ₹2,000 Budget over 7 Days  

This worklog records the actual human-in-the-loop decisions, prompts, model proposals, and deliberate architectural and strategic rejections made during the planning and construction of this submission.

---

## Entry 1 - Growth Strategy: Paid Ads vs. Campus-Led Referral Loop

**What I asked:**  
"I need to get 500 final-year engineering students in Tier-2/3/4 colleges to register for NxtWave's free 60-minute AI workshop in 7 days with a budget of ₹2,000. Give me a step-by-step acquisition plan."

**What AI suggested:**  
1. Run targeted Instagram and Meta ads targeting engineering students in Andhra Pradesh, Telangana, and Tamil Nadu with a budget of ₹1,500.
2. Use remaining ₹500 for paid micro-influencer shoutouts in college tech meme pages.
3. Scrape student email lists and college WhatsApp group links from LinkedIn/Telegram and send bulk broadcast messages.
4. Add high-urgency countdowns on the landing page ("Only 35 seats left!").

**What I changed or rejected, and why:**  
- **Rejected Meta Ads as the core driver:** The arithmetic disproved it immediately. At realistic student-workshop acquisition costs of ₹30–₹80 per registration, ₹2,000 generates at most 25–65 signups (5%–13% of target). Relying on ads is mathematically guaranteed to fail.
- **Rejected Contact Scraping & Bulk Blasts:** Mass unsolicited messaging violates privacy, triggers WhatsApp anti-spam bans, and damages trust.
- **Rejected Fake Scarcity:** False "seat limits" on an online workshop destroy credibility.
- **My Strategic Shift:** Public college reports and NxtWave event records show workshops spread through trusted campus channels (placement cells, department HODs, club leads, and peer groups). I redirected ₹1,000 to capped vouchers for top referrers (paid only after workshop attendance), ₹600 to a controlled A/B hook test, and ₹400 to a Day-4 rescue reserve. I instituted "Squad Race" — an organic, tribal college-vs-college referral engine with a modeled k-factor of 0.24 to scale 380 seed registrations to 500.

**Final output:**  
A 4-channel organic-led plan (Campus Champions, Placement/HoD emails, Student Clubs, Small Paid Test) with a Day-4 pacing gate and transparent funnel mathematics (documented on Slide 2 and 3 of `Growth_Plan.pdf`).

---

## Entry 2 - Working Asset Architecture: Landing Page vs. Referral Engine

**What I asked:**  
"The challenge asks for one working asset that supports the plan. Everyone usually builds a standard landing page. What asset architecture best proves execution capability and drives the 500 target?"

**What AI suggested:**  
- Option A: High-converting landing page with animated hero, curriculum accordion, and registration form.
- Option B: Full-blown WhatsApp Business API chatbot with automated interactive registration.
- Option C: An end-to-end AI project grader that reviews GitHub repos submitted by students.
- Option D: A hybrid referral engine with live college leaderboard, personal squad share cards, and a growth simulator.

**What I changed or rejected, and why:**  
- **Rejected Option A (Just a landing page):** A landing page is merely a doorway, not a growth mechanism. It doesn't solve peer-to-peer distribution.
- **Rejected Option B (WhatsApp Bot):** Meta WhatsApp Business verification and template approval can take 48–72 hours and incurs per-conversation API costs, introducing severe operational risk within a 48-hour submission window.
- **Rejected Option C (AI Grader during acquisition):** While project completion is a documented leak, building an evaluator during the registration sprint over-scopes the 48-hour deliverable. I moved this to "What I would do in another 24 hours" (Slide 5).
- **Accepted & Expanded Option D:** Built the "Squad Race" web app featuring:
  1. 20-second frictionless mobile registration (no phone number required, zero tracking pixels).
  2. Instant Squad Card (`/s/[code]`) with personalized branch-aware WhatsApp prefilled shares.
  3. Public College Leaderboard (`/race`) pitting colleges against each other with live counts.
  4. Growth Dashboard (`/growth`) with live vs. demo mode toggle, pacing tracking, and observed k-factor.
  5. Interactive "Path to 500" Funnel Simulator (`/plan`) with scenario presets matching the slide deck.

**Final output:**  
Complete Next.js App Router full-stack web asset deployed with server route handlers, fraud defense (disposable email filters, IP rate-limits, deduplication), and dual SQLite/Supabase compatibility.

---

## Entry 3 - Tech Stack & Reliability: Preventing the 7-Day Free-Tier Outage

**What I asked:**  
"What is the best zero-cost stack to deploy this asset so reviewers can access it anytime without cold starts or database downtime?"

**What AI suggested:**  
"Deploy Next.js on Vercel Hobby and use Supabase Free Tier Postgres with Prisma or Supabase client."

**What I changed or rejected, and why:**  
- **Identified Critical Risk:** Supabase free tier projects automatically pause after 7 days of inactivity. If reviewers test the link a week later, they encounter a dead database error.
- **My Technical Decisions:**
  1. Implemented a dual-engine database architecture: A resilient local/embedded SQL engine with identical schema and migrations that works out of the box with zero external configuration, plus seamless Supabase Postgres connection if credentials are provided in `.env.local`.
  2. Built a comprehensive `/api/health` diagnostic endpoint returning uptime, database status, and table counts.
  3. Added an automated GitHub Actions cron workflow (`.github/workflows/keepalive.yml`) that pings `/api/health` every 48 hours to prevent cloud pause.
  4. Added graceful fallback error screens and banner notifications so the UI never displays an unhandled crash.

**Final output:**  
Rock-solid deployment architecture with automated keep-alive, diagnostic health endpoint, and graceful degradation.
