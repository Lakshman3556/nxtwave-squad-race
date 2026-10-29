"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLLEGE_LIST, BRANCHES, WORKSHOP_DETAILS, OFFER_CONFIG } from "@/content";
import { captureAndPersistAttribution, trackEvent } from "@/lib/attribution";
import {
  Sparkles,
  Trophy,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  Flame,
  Search,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college_id: "",
    college_other: "",
    branch: "",
    grad_year: "2027",
    consent: true,
  });

  const [attribution, setAttribution] = useState<{
    refCode: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
  }>({ refCode: null, utmSource: null, utmMedium: null, utmCampaign: null });

  const [referrerInfo, setReferrerInfo] = useState<{ name: string; college: string } | null>(null);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Countdown timer for 7-day cohort deadline
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    // Capture attribution on client load
    const attr = captureAndPersistAttribution();
    setAttribution(attr);
    trackEvent("view", attr.refCode, attr.utmSource);

    // If refCode present, fetch referrer's preview
    if (attr.refCode) {
      fetch(`/api/squad/${attr.refCode}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setReferrerInfo({
              name: json.data.name.split(" ")[0],
              college: json.data.college_name,
            });
          }
        })
        .catch(() => {});
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackEvent("form_start", attribution.refCode, attribution.utmSource);
    }
  };

  const filteredColleges = COLLEGE_LIST.filter((c) =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please provide a valid college or personal email.");
      return;
    }
    if (!formData.college_id) {
      setErrorMsg("Please select your engineering college.");
      return;
    }
    if (formData.college_id === "other" && !formData.college_other.trim()) {
      setErrorMsg("Please type your college name.");
      return;
    }
    if (!formData.branch) {
      setErrorMsg("Please select your branch.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ref_code: attribution.refCode,
          utm_source: attribution.utmSource,
          utm_medium: attribution.utmMedium,
          utm_campaign: attribution.utmCampaign,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setErrorMsg(data.message || "Registration failed. Please check inputs.");
        setSubmitting(false);
        return;
      }

      // Track submit event
      trackEvent("submit", attribution.refCode, attribution.utmSource);

      // Instantly route straight to personal squad card
      router.push(`/s/${data.registration.referral_code}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-start">
      {/* Top Referral Banner if referred by peer */}
      {referrerInfo && (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border-b border-emerald-500/30 px-4 py-2 text-center text-xs text-emerald-200 flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Invited by <strong className="text-white">{referrerInfo.name}</strong> from{" "}
            <span className="text-emerald-300 font-medium">{referrerInfo.college}</span>. Registering scores a point for your college!
          </span>
        </div>
      )}

      {/* Hero & Registration Section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Outcome-First Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
              <Flame className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>Placement Season AI Accelerator • 2027 Batch</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {WORKSHOP_DETAILS.heroHook}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {WORKSHOP_DETAILS.secondaryHook} Join thousands of engineering classmates in the hands-on 60-minute build session.
            </p>

            {/* Countdown Timer strip */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 max-w-lg shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Cohort Registration Closes In:
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Real Deadline
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-950/90 rounded-xl py-2 px-1 border border-slate-800">
                  <span className="block text-xl font-bold text-white">{timeLeft.days}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Days</span>
                </div>
                <div className="bg-slate-950/90 rounded-xl py-2 px-1 border border-slate-800">
                  <span className="block text-xl font-bold text-white">{timeLeft.hours}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Hours</span>
                </div>
                <div className="bg-slate-950/90 rounded-xl py-2 px-1 border border-slate-800">
                  <span className="block text-xl font-bold text-white">{timeLeft.minutes}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Mins</span>
                </div>
                <div className="bg-slate-950/90 rounded-xl py-2 px-1 border border-slate-800">
                  <span className="block text-xl font-bold text-emerald-400">{timeLeft.seconds}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Secs</span>
                </div>
              </div>
            </div>

            {/* What you get proof grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">1 Working AI Project</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Live deployed link to showcase on your GitHub and resume.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">College Squad Race</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Put your campus on the leaderboard & win top referrers vouchers.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">
                    {OFFER_CONFIG.CERTIFICATE_CONFIRMED ? "Verified Certificate" : "Hands-On Experience"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {OFFER_CONFIG.CERTIFICATE_CONFIRMED
                      ? "Official completion certificate issued after verified workshop attendance."
                      : "Direct hands-on building in Google Colab."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 20-Second Frictionless Registration Form */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Claim Your Free Seat
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">20-second registration • No phone number needed</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  100% Free
                </span>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lakshman Reddy"
                    value={formData.name}
                    onFocus={handleInputFocus}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.name[0]}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. lakshman@college.edu or gmail"
                    value={formData.email}
                    onFocus={handleInputFocus}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Workshop access link will be emailed here.</p>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.email[0]}</p>
                  )}
                </div>

                {/* College Selection (Searchable) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College Name <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.college_id}
                    onFocus={handleInputFocus}
                    onChange={(e) => setFormData({ ...formData, college_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  >
                    <option value="">Select your engineering college...</option>
                    {COLLEGE_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                    <option value="other">Other (My college is not listed)</option>
                  </select>

                  {formData.college_id === "other" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        required
                        placeholder="Type full college name & city..."
                        value={formData.college_other}
                        onChange={(e) => setFormData({ ...formData, college_other: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}
                  {fieldErrors.college_id && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.college_id[0]}</p>
                  )}
                </div>

                {/* Branch & Grad Year in one responsive row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Branch <span className="text-rose-400">*</span>
                    </label>
                    <select
                      required
                      value={formData.branch}
                      onFocus={handleInputFocus}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">Select branch...</option>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Graduation Year <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.grad_year}
                      onChange={(e) => setFormData({ ...formData, grad_year: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="2027">Final Year (2027 Batch)</option>
                      <option value="2026">2026 Passing Out</option>
                      <option value="2028">3rd Year (2028)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 h-4 w-4 shrink-0"
                    />
                    <span>
                      I consent to receive workshop joining link, reminders, and starter project resources. (Zero spam. No phone number stored.)
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer min-h-[48px]"
                >
                  {submitting ? (
                    <span>Registering & Generating Squad Link...</span>
                  ) : (
                    <>
                      <span>Register Free & Get Squad Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>⚡ Instant Squad Link</span>
                <span>🔒 Strict Data Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
