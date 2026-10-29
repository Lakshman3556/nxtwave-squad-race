"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { trackEvent } from "@/lib/attribution";
import {
  Share2,
  Copy,
  Check,
  Trophy,
  Users,
  Sparkles,
  ArrowRight,
  Gift,
  Award,
  ChevronRight,
  Flame,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

interface SquadData {
  name: string;
  referral_code: string;
  college_id: string;
  college_name: string;
  branch: string;
  grad_year: string;
  referrals_count: number;
  college_rank: number;
  college_total: number;
  friends: Array<{ first_name: string; branch: string; created_at: string }>;
  rewards: {
    starter_kit_unlocked: boolean;
    starter_kit_needed: number;
    champion_unlocked: boolean;
    champion_needed: number;
  };
}

interface ProjectIdea {
  title: string;
  desc: string;
  resumeLine: string;
}

export default function SquadCardPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);

  const [squad, setSquad] = useState<SquadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedResumeIdx, setCopiedResumeIdx] = useState<number | null>(null);

  // AI Idea Generator state
  const [selectedInterest, setSelectedInterest] = useState("LLMs & RAG");
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);

  const interestChips = [
    "LLMs & RAG",
    "Computer Vision",
    "TinyML / Edge AI",
    "Autonomous Agents",
    "Time Series & Predictive ML",
  ];

  useEffect(() => {
    // Fire celebratory confetti on first view
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    fetch(`/api/squad/${code}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSquad(json.data);
          // Auto load initial project ideas for their branch
          loadAiIdeas(json.data.branch, "LLMs & RAG");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [code]);

  const loadAiIdeas = async (branch: string, interest: string) => {
    setGeneratingIdeas(true);
    try {
      const res = await fetch("/api/ai-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch, interest }),
      });
      const data = await res.json();
      if (data.success && data.ideas) {
        setIdeas(data.ideas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const getReferralUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/?ref=${code}`;
    }
    return `https://nxtwave-squad-race.vercel.app/?ref=${code}`;
  };

  const handleCopy = () => {
    const url = getReferralUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    trackEvent("copy_link", code, "squad_card");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyResumeLine = (line: string, idx: number) => {
    navigator.clipboard.writeText(line);
    setCopiedResumeIdx(idx);
    setTimeout(() => setCopiedResumeIdx(null), 2000);
  };

  const handleWhatsAppShare = () => {
    trackEvent("wa_click", code, "squad_card");
    const url = getReferralUrl();
    const branchName = squad?.branch ? squad.branch.split(" (")[0] : "Engineering";
    const text = `Hey! I just registered for NxtWave's free hands-on workshop: "Build Your First AI Project in 60 Minutes". 

We leave with an actual working AI project to demo in placement interviews (especially relevant for ${branchName}).

Join our college squad through my link so we can climb the leaderboard together:
${url}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading your Squad Card...</p>
        </div>
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Squad Card Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">This referral code may be incorrect or expired.</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
        >
          Register for Workshop
        </Link>
      </div>
    );
  }

  const referralCount = squad.referrals_count;
  const progressPercent = Math.min(100, Math.round((referralCount / 10) * 100));

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Squad Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 rounded-3xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Registration Confirmed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {squad.name}&apos;s Squad Card
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {squad.college_name} • <span className="text-slate-300">{squad.branch}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Referral Code
              </span>
              <span className="text-2xl font-mono font-black text-emerald-400 tracking-wider">
                {squad.referral_code}
              </span>
            </div>
          </div>
        </div>

        {/* Big WhatsApp CTA & Share Link */}
        <div className="pt-6 space-y-4">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-transform active:scale-[0.98] cursor-pointer min-h-[52px]"
          >
            <Share2 className="w-5 h-5 fill-slate-950" />
            <span>Share on WhatsApp & Invite Classmates</span>
          </button>

          {/* Copy Link input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={getReferralUrl()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats & Leaderboard Rank Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Verified Referrals */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium">Your Referrals</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{referralCount}</span>
              <span className="text-xs text-emerald-400 font-semibold">Friends Joined</span>
            </div>
          </div>
        </div>

        {/* Metric 2: College Rank */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium">College Rank</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">#{squad.college_rank}</span>
              <span className="text-xs text-slate-400">({squad.college_total} signups)</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Next Milestone */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium">Reward Status</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-white">
                {squad.rewards.starter_kit_unlocked ? "Starter Kit Unlocked 🎉" : `${squad.rewards.starter_kit_needed} more for Kit`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Progress Bar */}
      <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            Squad Milestone Progress
          </span>
          <span className="text-emerald-400 font-bold">{referralCount} / 10 Referrals</span>
        </div>

        {/* Progress track */}
        <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
          <div className={`p-3 rounded-xl border ${squad.rewards.starter_kit_unlocked ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300" : "bg-slate-950/40 border-slate-800/80 text-slate-400"}`}>
            <span className="font-bold block text-white mb-0.5">Tier 1 (3 Referrals)</span>
            <span>AI Starter Kit (Free resources + project repos)</span>
            {squad.rewards.starter_kit_unlocked && (
              <Link href="/rewards/starter-kit" className="inline-flex items-center gap-1 text-emerald-400 font-bold mt-1 text-[11px] underline">
                Access Starter Kit <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className={`p-3 rounded-xl border ${squad.rewards.champion_unlocked ? "bg-amber-950/40 border-amber-500/40 text-amber-300" : "bg-slate-950/40 border-slate-800/80 text-slate-400"}`}>
            <span className="font-bold block text-white mb-0.5">Tier 2 (10 Referrals)</span>
            <span>Campus Champion Certificate & Vouchers Eligible</span>
          </div>
        </div>
      </div>

      {/* AI "Your First AI Project Idea" Generator (P1) */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Your First AI Project Ideas ({squad.branch.split(" (")[0]})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant project ideas tailored for your branch with copy-ready resume lines.
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 w-fit">
            Deterministic AI Mentor
          </span>
        </div>

        {/* Interest Chips */}
        <div>
          <span className="block text-xs font-semibold text-slate-400 mb-2">Select Focus Area:</span>
          <div className="flex flex-wrap gap-2">
            {interestChips.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setSelectedInterest(chip);
                  loadAiIdeas(squad.branch, chip);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  selectedInterest === chip
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        {generatingIdeas ? (
          <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span>Generating tailored ideas...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    {idea.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{idea.desc}</p>
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-900">
                  <div className="text-[11px] font-mono text-emerald-400/90 bg-emerald-950/30 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 flex-1">
                    💼 {idea.resumeLine}
                  </div>
                  <button
                    onClick={() => handleCopyResumeLine(idea.resumeLine, idx)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedResumeIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Bullet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friends who joined via squad link */}
      <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          Friends in Your Squad ({squad.friends.length})
        </h3>
        {squad.friends.length === 0 ? (
          <p className="text-xs text-slate-500">
            No classmates have registered through your link yet. Share your squad link in your branch WhatsApp group to earn points!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {squad.friends.map((f, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                <span className="font-bold text-slate-200 block">{f.first_name}</span>
                <span className="text-[11px] text-slate-400">{f.branch}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
