# Squad Race: Quality Assurance & Manual Test Report
**Project:** NxtWave Growth Challenge Submission  
**Candidate:** Lakshman (Final-Year B.E. IT Student, Hyderabad)  
**Date:** 28 October 2026  

---

## 1. Automated Test Execution Summary

Command: `npm run test` (`npx tsx scripts/run_tests.ts`)  
Result: **7/7 Passed (100%)**

| Test Case | Scope | Status | Notes |
| :--- | :--- | :---: | :--- |
| **1. Referral Code Alphabet** | Security & UX | **PASS** | Validated 100 codes. Length strictly 6. Alphabet excludes ambiguous characters (`0`, `O`, `1`, `I`, `L`). |
| **2. Email Deduplication** | Growth Integrity | **PASS** | Case-insensitive match on `email_lower`. Duplicate registration seamlessly routes back to existing squad card without error. |
| **3. Self-Referral Prevention** | Fraud Guardrail | **PASS** | Attribution engine ignores referral code matching registrant's own email. |
| **4. Admin Void / Leaderboard Sync** | Admin Controls | **PASS** | Voiding a registration decrements the referrer's verified count and college points in real time. Restoring reinstates points. |
| **5. Simulator Mathematical Proof** | Growth Modeling | **PASS** | Plan preset returns `380 / (1 - 0.24) = 500` exactly, matching Slide 3 of `Growth_Plan.pdf`. |
| **6. WhatsApp Share Length** | Mobile UX | **PASS** | Share message template is 342 characters (strictly under 450 char mobile preview limit). |
| **7. AI Deterministic Fallback** | Reliability | **PASS** | Verified instant, 100% reliable fallback for all branches (CSE, ECE, EEE, Mech, Civil) with tailored resume lines. |

---

## 2. End-to-End Manual Testing Script & Results

### Test Flow 1: Registration on 390px Mobile Viewport
- **Device Tested:** Chromium DevTools throttled to Mobile 390px × 844px (iPhone 12/13/14 viewport) and slow 4G.
- **Observations:**
  - Hero outcome hook ("Leave with a working AI project you can demo in your next interview") and 7-day countdown timer render above the fold.
  - Registration form requires 4 inputs (Name, Email, College dropdown, Branch) plus consent checkbox. Form completion time: ~18 seconds.
  - Zero phone numbers requested; zero external tracking scripts loaded.
  - On submit: Instant redirect to `/s/[code]`, triggering confetti micro-interaction and personalized squad card.
- **Result:** **PASS**

### Test Flow 2: WhatsApp Share Interaction
- **Steps:**
  1. Opened `/s/[code]` on mobile viewport.
  2. Clicked big green button: *"Share on WhatsApp & Invite Classmates"*.
  3. Inspected opened URI scheme: `https://wa.me/?text=...`
  4. Verified message text includes branch-specific value hook, workshop duration (60 Mins), and clean referral URL `?ref=[code]`.
- **Result:** **PASS**

### Test Flow 3: Referral Attribution Propagation
- **Steps:**
  1. Copied squad link from Student A (`?ref=CODE_A`).
  2. Opened incognito session and registered Student B with college "Vasavi College of Engineering".
  3. Checked Student A's squad card at `/s/CODE_A`: Verified referral count incremented by 1; Student B's first name appeared in *"Friends in Your Squad"*.
  4. Checked `/race`: Vasavi College gained +1 registration immediately.
- **Result:** **PASS**

### Test Flow 4: Admin Fraud Voiding & Count Updates
- **Steps:**
  1. Navigated to `/admin?key=nxtwave_growth_2027`.
  2. Located Student B's registration and clicked *"Void"*.
  3. Entered reason: *"Manual audit test"*.
  4. Inspected `/race` and `/s/CODE_A`: Verified referral count decremented by 1 and college total decremented by 1.
  5. Clicked *"Restore"* on `/admin`: Verified counts restored.
- **Result:** **PASS**

### Test Flow 5: Health & Reliability Diagnostic
- **Steps:**
  1. Sent GET request to `/api/health`.
  2. Verified JSON payload:
     ```json
     {
       "status": "healthy",
       "uptime_seconds": 1284,
       "database": {
         "engine": "Embedded Relational Engine (Supabase-compatible)",
         "status": "connected",
         "live_registrations": 4,
         "demo_registrations": 484
       }
     }
     ```
- **Result:** **PASS**

### Test Flow 6: CSV Data Export
- **Steps:**
  1. Clicked *"Export CSV"* in `/admin`.
  2. Downloaded `squad_race_registrations_demo.csv`.
  3. Verified CSV headers (`ID, Created At, Name, Email, College, Branch, Year, Referral Code, Referred By Code, Source, Status, Void Reason, Is Demo`).
  4. Verified escaped quotes and proper UTF-8 formatting.
- **Result:** **PASS**
