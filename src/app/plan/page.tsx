"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Info,
} from "lucide-react";

interface SimulatorInputs {
  champions: number;
  championReach: number;
  championConv: number; // percentage, e.g. 3.0
  placementEmails: number;
  placementAdoption: number; // percentage, e.g. 3.3
  placementPerCollege: number;
  clubsCount: number;
  clubRegs: number;
  socialPaidRegs: number;
  shareRate: number; // percentage, e.g. 40
  friendsPerSharer: number; // e.g. 0.6
}

const DEFAULT_PLAN: SimulatorInputs = {
  champions: 20,
  championReach: 320,
  championConv: 3.0,
  placementEmails: 300,
  placementAdoption: 3.33,
  placementPerCollege: 10,
  clubsCount: 6,
  clubRegs: 10,
  socialPaidRegs: 30,
  shareRate: 40,
  friendsPerSharer: 0.6,
};

export default function SimulatorPage() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_PLAN);
  const [activePreset, setActivePreset] = useState<string>("plan");

  // Funnel calculations
  const championSeeds = Math.round(inputs.champions * inputs.championReach * (inputs.championConv / 100));
  const adoptingColleges = Math.round(inputs.placementEmails * (inputs.placementAdoption / 100));
  const placementSeeds = Math.round(adoptingColleges * inputs.placementPerCollege);
  const clubSeeds = Math.round(inputs.clubsCount * inputs.clubRegs);
  const socialSeeds = inputs.socialPaidRegs;

  const totalSeed = championSeeds + placementSeeds + clubSeeds + socialSeeds;

  // k = share_rate * friends_joining_per_sharer
  const kFactor = Number(((inputs.shareRate / 100) * inputs.friendsPerSharer).toFixed(3));
  const denominator = Math.max(0.05, 1 - kFactor);
  const totalRegistrations = Math.round(totalSeed / denominator);
  const gapTo500 = totalRegistrations - 500;

  // Preset Handlers
  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    if (presetName === "plan") {
      setInputs({ ...DEFAULT_PLAN });
    } else if (presetName === "referral_weak") {
      setInputs({
        ...DEFAULT_PLAN,
        shareRate: 25,
        friendsPerSharer: 0.4, // k = 0.10 -> 380 / 0.90 = 422
      });
    } else if (presetName === "seeding_weak") {
      setInputs({
        ...DEFAULT_PLAN,
        championReach: 256, // -20% -> 304 seed, k = 0.24 -> 400
      });
    } else if (presetName === "both_weak") {
      setInputs({
        ...DEFAULT_PLAN,
        championReach: 256,
        shareRate: 25,
        friendsPerSharer: 0.4, // 304 seed, k = 0.10 -> 338
      });
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Disclaimer Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Methodology Note:</strong> Every conversion rate here is an explicit assumption to validate. The funnel is modeled parametrically so reviewers can test sensitivity and stress-test failure modes.
        </span>
      </div>

      {/* Header & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Cpu className="w-4 h-4" />
            <span>Parametric Growth Model</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            &apos;Path to 500&apos; Simulator
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Interactive scenario builder matching Slide 3 of the Growth Plan. Adjust channels and viral loop parameters to calculate projected registrations.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => applyPreset("plan")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activePreset === "plan"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Plan (500)
          </button>
          <button
            onClick={() => applyPreset("referral_weak")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activePreset === "referral_weak"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Referral Weak (422)
          </button>
          <button
            onClick={() => applyPreset("seeding_weak")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activePreset === "seeding_weak"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Seeding Weak (400)
          </button>
          <button
            onClick={() => applyPreset("both_weak")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activePreset === "both_weak"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Both Weak (338)
          </button>
        </div>
      </div>

      {/* Main Results Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 rounded-3xl p-6 border border-emerald-500/40 md:col-span-2 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Projected Total Registrations
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white font-mono">{totalRegistrations}</span>
              <span className="text-sm font-semibold text-slate-400">/ 500 Goal</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Formula: <code className="text-emerald-400 font-mono">Total = Seed / (1 - k)</code>
            </span>
            <span
              className={`font-bold px-2.5 py-1 rounded-lg ${
                gapTo500 >= 0
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {gapTo500 >= 0 ? `+${gapTo500} Surplus` : `${gapTo500} Shortfall`}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 uppercase font-medium">Seed Registrations</span>
          <div className="my-2">
            <span className="text-4xl font-black text-white font-mono">{totalSeed}</span>
            <span className="text-xs text-slate-500 block mt-1">4 Direct Channels</span>
          </div>
          <span className="text-[11px] text-slate-400">Before referral loop compounding</span>
        </div>

        <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 uppercase font-medium">Modeled k-Factor</span>
          <div className="my-2">
            <span className="text-4xl font-black text-emerald-400 font-mono">{kFactor.toFixed(2)}</span>
            <span className="text-xs text-slate-500 block mt-1">Viral Multiplier: {(1 / denominator).toFixed(2)}x</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {inputs.shareRate}% share rate × {inputs.friendsPerSharer} joins
          </span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Seed Distribution Sliders */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>1. Direct Channel Seeding Parameters</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">{totalSeed} Seeds</span>
          </div>

          <div className="space-y-5">
            {/* Champions Count */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Campus Champions Recruited</span>
                <span className="font-mono font-bold text-emerald-400">{inputs.champions} leads</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={inputs.champions}
                onChange={(e) => setInputs({ ...inputs, champions: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Reach per Champion */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Final-Year Reach per Champion (unique)</span>
                <span className="font-mono font-bold text-emerald-400">{inputs.championReach} students</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="20"
                value={inputs.championReach}
                onChange={(e) => setInputs({ ...inputs, championReach: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Champion Conversion */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Champion Message Conversion Rate (%)</span>
                <span className="font-mono font-bold text-emerald-400">{inputs.championConv}%</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={inputs.championConv}
                onChange={(e) => setInputs({ ...inputs, championConv: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Yield: ~{championSeeds} signups</span>
            </div>

            {/* Placement Emails */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Placement Cell / HoD Emails Sent</span>
                <span className="font-mono font-bold text-indigo-400">{inputs.placementEmails} colleges</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="25"
                value={inputs.placementEmails}
                onChange={(e) => setInputs({ ...inputs, placementEmails: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Placement Adoption */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Placement Adoption Rate (%)</span>
                <span className="font-mono font-bold text-indigo-400">
                  {inputs.placementAdoption.toFixed(1)}% (~{adoptingColleges} colleges)
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.1"
                value={inputs.placementAdoption}
                onChange={(e) => setInputs({ ...inputs, placementAdoption: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Yield: ~{placementSeeds} signups</span>
            </div>

            {/* Student Clubs */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Clubs Co-Posting (GDG/IEEE/ACM)</span>
                <span className="font-mono font-bold text-teal-400">{inputs.clubsCount} clubs</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                value={inputs.clubsCount}
                onChange={(e) => setInputs({ ...inputs, clubsCount: Number(e.target.value) })}
                className="w-full accent-teal-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Yield: ~{clubSeeds} signups</span>
            </div>
          </div>
        </div>

        {/* Right: Referral Engine Parameters & Scenarios */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>2. Squad Race Referral Loop Parameters</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">k = {kFactor.toFixed(2)}</span>
            </div>

            <div className="space-y-5">
              {/* Share Rate */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Share Rate (Registrants clicking WhatsApp share)</span>
                  <span className="font-mono font-bold text-emerald-400">{inputs.shareRate}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={inputs.shareRate}
                  onChange={(e) => setInputs({ ...inputs, shareRate: Number(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Friends per Sharer */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Friends Joining per Sharer</span>
                  <span className="font-mono font-bold text-emerald-400">{inputs.friendsPerSharer}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.2"
                  step="0.05"
                  value={inputs.friendsPerSharer}
                  onChange={(e) => setInputs({ ...inputs, friendsPerSharer: Number(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Scenario Comparison Table (From Slide 3) */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Sensitivity Scenario Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-medium">
                    <th className="py-2 px-2">Scenario</th>
                    <th className="py-2 px-2">Seed</th>
                    <th className="py-2 px-2">k</th>
                    <th className="py-2 px-2">Total</th>
                    <th className="py-2 px-2">Action / Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className={activePreset === "plan" ? "bg-emerald-950/30 text-emerald-300 font-bold" : ""}>
                    <td className="py-2.5 px-2 font-sans">Plan</td>
                    <td className="py-2.5 px-2">380</td>
                    <td className="py-2.5 px-2">0.24</td>
                    <td className="py-2.5 px-2 text-white">500</td>
                    <td className="py-2.5 px-2 font-sans text-slate-300">Stay the course.</td>
                  </tr>
                  <tr className={activePreset === "referral_weak" ? "bg-amber-950/30 text-amber-300 font-bold" : ""}>
                    <td className="py-2.5 px-2 font-sans">Referral weak</td>
                    <td className="py-2.5 px-2">380</td>
                    <td className="py-2.5 px-2">0.10</td>
                    <td className="py-2.5 px-2 text-white">422</td>
                    <td className="py-2.5 px-2 font-sans text-slate-400">Raise share prompts, add day-5 college bonus.</td>
                  </tr>
                  <tr className={activePreset === "seeding_weak" ? "bg-amber-950/30 text-amber-300 font-bold" : ""}>
                    <td className="py-2.5 px-2 font-sans">Seeding weak (-20%)</td>
                    <td className="py-2.5 px-2">304</td>
                    <td className="py-2.5 px-2">0.24</td>
                    <td className="py-2.5 px-2 text-white">400</td>
                    <td className="py-2.5 px-2 font-sans text-slate-400">Day-4 rescue: 2nd wave of club DMs, push champions.</td>
                  </tr>
                  <tr className={activePreset === "both_weak" ? "bg-rose-950/30 text-rose-300 font-bold" : ""}>
                    <td className="py-2.5 px-2 font-sans">Both weak</td>
                    <td className="py-2.5 px-2">304</td>
                    <td className="py-2.5 px-2">0.10</td>
                    <td className="py-2.5 px-2 text-white">338</td>
                    <td className="py-2.5 px-2 font-sans text-slate-400">Be honest: 500 at risk; focus on top 5 colleges.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
