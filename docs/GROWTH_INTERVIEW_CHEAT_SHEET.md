# Growth Interview Cheat Sheet for Lakshman
**Role:** Growth Intern (Round 1 Growth Challenge)  
**Company:** NxtWave  
**Candidate:** Lakshman (Final-Year B.E. IT Student, Hyderabad)  

Use this cheat sheet to review and prepare for the live interview. It arms you with concise, principled answers highlighting your ownership, business judgment, and bias to ship.

---

### 1. "Why didn't you just build a high-converting landing page and run ads?"
**The Core Answer:**  
"The arithmetic killed that idea immediately. At typical student-workshop customer acquisition costs of ₹30 to ₹80 per registration on Meta/LinkedIn, our ₹2,000 budget would buy between 25 and 65 signups at best—only 5% to 13% of our 500-student goal. Furthermore, public data from past college workshops shows that free events spread through trusted institutional and peer networks: placement cells, department HODs, student clubs, and class WhatsApp groups. Final-year students don't trust sponsored social ads during drive season; they trust their class representatives and placement volunteers. That's why I made trusted human seeding plus a collegiate referral loop the growth engine, using ₹600 on ads only as a measured hook experiment."

---

### 2. "Where do your funnel numbers come from?"
**The Core Answer:**  
"Every single conversion rate in the plan is explicitly tagged as an assumption to validate, not hard fact. The funnel is modeled parametrically:
- 20 campus champions reaching 320 unique students at a 3.0% conversion = 192 seeds.
- 300 placement cell emails at 3.3% adoption (10 colleges) bringing 10 students each = 100 seeds.
- 6 clubs bringing 10 students = 60 seeds.
- Social & ₹600 paid test = 30 seeds.
- Direct seed total = 380.
- Referral viral coefficient $k = 40\% \text{ share rate} \times 0.6 \text{ friends per sharer} = 0.24$.
- Total $= 380 / (1 - 0.24) = 500$.
Crucially, I built the 'Path to 500' simulator and the 3 experiments so that as live data comes in from Day 1 to 3, real conversion rates replace these assumptions."

---

### 3. "What if only 300 registrations come in by Day 5?"
**The Core Answer:**  
"I planned for failure modes on Slide 3 with a strict Day-4 pacing gate. Our Day-4 target is 290 cumulative signups. If we are tracking below 250 by Day 4, the plan triggers three pre-planned rescue levers:
1. Deploying the ₹400 reserve budget into an inter-college bonus challenge for top-performing campuses.
2. Launching a second targeted wave of branch-specific messages ('AI for ECE/EEE/Mech') through student clubs.
3. If pacing still lags, I will be completely transparent: rather than spraying untargeted outreach, I would concentrate all remaining effort on the top 5 colleges with active momentum to protect cohort density, and request an extension if cohort quality remains high."

---

### 4. "How do you stop referral fraud and bot sign-ups?"
**The Core Answer:**  
"I implemented four distinct layers of fraud defense in the working asset:
1. **Deduplication:** Normalizing emails to lowercase; duplicate emails seamlessly return the existing squad card without creating extra entries.
2. **Disposable Domain Filtering:** Automatically voids registrations from temporary mail services (Mailinator, TempMail, etc.).
3. **IP Rate Limiting & Hashing:** Flags more than 5 signups per IP per hour as 'provisional' using salted SHA-256 IP hashes (no raw IP storage for privacy).
4. **Reward Design:** No cash per referral. We offer capped vouchers (₹500 / ₹300 / ₹200) awarded strictly to the top 3 referrers whose referred friends actively attend the live workshop."

---

### 5. "Why did you choose a college-vs-college leaderboard?"
**The Core Answer:**  
"College identity is tribal and deeply emotional inside Indian engineering WhatsApp groups. When an individual shares a referral link, it often feels transactional. But when a student shares: 'Our college is ranked #7 on the Squad Race leaderboard, 3 signups behind CBIT, let's take #1', it turns a solo registration into a collegiate rallying cry. It achieves higher viral sharing at zero marginal cost. Test 2 specifically tests whether this collegiate framing outperforms an individual rank card."

---

### 6. "What would you measure after the registration campaign closes?"
**The Core Answer:**  
"Registration is only top-of-funnel vanity if students don't attend and finish. In fact, a public college report from a June 2025 AI workshop revealed that out of 1,218 registered students and 1,139 attendees, only 42 students actually submitted their final AI project. The real leak in student education funnels is completion and submission, not registration. I track 'show-up rate' and 'project submission rate', which is why my 24-hour next step is an automated AI rubric evaluator giving instant submission feedback."

---

### 7. "What did you learn while building this challenge?"
**The Core Answer:**  
"Two key learnings:
1. **Growth is unit economics first, creative second:** The simple arithmetic of ₹2,000 vs. ₹50 CPR completely reshaped the strategy from an ad-driven landing page to an organic referral engine.
2. **Infrastructure resilience matters:** While researching deployment on Supabase free tier, I discovered projects auto-pause after 7 days of inactivity. Rather than risking a broken link for reviewers, I built a diagnostic `/api/health` endpoint and an automated GitHub Actions cron workflow to keep the database active."
