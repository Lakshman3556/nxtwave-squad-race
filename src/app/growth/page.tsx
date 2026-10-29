"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Sparkles,
  PieChart,
  GitBranch,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { GrowthDashboardData } from "@/lib/types";

export default function GrowthDashboardPage() {
  const [data, setData] = useState<GrowthDashboardData | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchGrowthData = (demoMode: boolean) => {
    setLoading(true);
    fetch(`/api/growth?demo=${demoMode}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchGrowthData(isDemo);
  }, [isDemo]);

  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Aggregating growth metrics...</p>
        </div>
      </div>
    );
  }

  const d4Progress = data?.daily_counts?.find((d) => d.day === 4);
  const d4Actual = d4Progress?.cumulative_actual || 0;
  const d4Target = 290;
  const isD4Passed = d4Actual >= 250;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Simulation Banner in Demo Mode */}
      {isDemo && (
        <div className="bg-amber-950/70 border border-amber-500/50 rounded-2xl p-4 text-xs text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>
              <strong>SIMULATION:</strong> Demo data generated across 7 simulated days matching pacing targets and channel weights. Real signups appear under Live.
            </span>
          </div>
          <button
            onClick={() => setIsDemo(false)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer shrink-0"
          >
            Switch to Live Data
          </button>
        </div>
      )}

      {/* Header and Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Aggregated Campaign Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Growth Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pacing versus 500-target, channel distribution, conversion funnel, and viral k-factor telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setIsDemo(true)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
              isDemo ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Demo Simulation (500)
          </button>
          <button
            onClick={() => setIsDemo(false)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
              !isDemo ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Live Campaign Data
          </button>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-medium">Total Registrations</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{data?.total_registrations || 0}</span>
            <span className="text-xs text-slate-500">/ 500 Target</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${Math.min(100, ((data?.total_registrations || 0) / 500) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-medium">Observed k-Factor</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">
              {data?.k_factor.observed_k || 0.24}
            </span>
            <span className="text-xs text-emerald-300 font-semibold">(Target: 0.24)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {data?.k_factor.projection_status}
          </p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-medium">Funnel Conversion</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-400">
              {data?.funnel.conversion_rate || 0}%
            </span>
            <span className="text-xs text-slate-500">View → Signup</span>
          </div>
          <p className="text-[11px] text-slate-500">Warm WhatsApp student traffic</p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-medium">Participating Colleges</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{data?.unique_colleges || 0}</span>
            <span className="text-xs text-slate-500">Campuses</span>
          </div>
          <p className="text-[11px] text-slate-500">Hyderabad, AP & TN hubs</p>
        </div>
      </div>

      {/* Pacing Curve Table & Day-4 Gate Check */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>7-Day Pacing Curve vs. Target</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cumulative pacing benchmarks: D1 60, D2 130, D3 210, D4 290, D5 370, D6 440, D7 500.
            </p>
          </div>

          {/* Day-4 Gate Indicator */}
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              isD4Passed
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/40 border-rose-500/40 text-rose-300"
            }`}
          >
            {isD4Passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
            <span>Day-4 Gate: {d4Actual >= 250 ? "Passed (≥250 pacing met)" : "Rescue Levers Triggered"}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-medium">
                <th className="py-2.5 px-3">Timeline</th>
                <th className="py-2.5 px-3">Day Actual</th>
                <th className="py-2.5 px-3">Day Target</th>
                <th className="py-2.5 px-3">Cumulative Actual</th>
                <th className="py-2.5 px-3">Cumulative Target</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {data?.daily_counts?.map((d) => {
                const diff = d.cumulative_actual - d.cumulative_target;
                const onTrack = diff >= -15;

                return (
                  <tr key={d.day} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-slate-200">{d.date}</td>
                    <td className="py-3 px-3 text-white">{d.actual}</td>
                    <td className="py-3 px-3 text-slate-400">{d.target}</td>
                    <td className="py-3 px-3 font-bold text-white">{d.cumulative_actual}</td>
                    <td className="py-3 px-3 text-slate-400">{d.cumulative_target}</td>
                    <td className={`py-3 px-3 font-bold ${diff >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          onTrack
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {onTrack ? "On Pace" : "Under Target"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: Channel Breakdown & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel Breakdown */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <span>Registrations by Source Channel</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">5 Channels</span>
          </div>

          <div className="space-y-3">
            {data?.source_breakdown.map((src) => (
              <div key={src.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{src.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{src.count}</span>
                    <span className="text-[11px] text-slate-500">({src.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                    style={{ width: `${src.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            Trusted human seeding drives ~380 seeds; Squad Race referral loop supplies the multiplying 120 registrations.
          </p>
        </div>

        {/* Funnel Metrics */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <span>Conversion Funnel Drop-off</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Telemetry</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Stage 1: Views */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-slate-200 block">1. Page Views</span>
                <span className="text-[10px] text-slate-500">WhatsApp & email link clicks</span>
              </div>
              <span className="text-base font-bold text-white">{data?.funnel.views}</span>
            </div>

            {/* Stage 2: Form Starts */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-slate-200 block">2. Form Starts</span>
                <span className="text-[10px] text-slate-500">Students focused on input field</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-white">{data?.funnel.form_starts}</span>
                <span className="block text-[10px] text-emerald-400">
                  {Math.round(((data?.funnel.form_starts || 0) / Math.max(data?.funnel.views || 1, 1)) * 100)}% of views
                </span>
              </div>
            </div>

            {/* Stage 3: Registrations */}
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-emerald-300 block">3. Completed Registrations</span>
                <span className="text-[10px] text-emerald-400/80">Submitted verified student profiles</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400">{data?.funnel.registrations}</span>
                <span className="block text-[10px] text-emerald-300 font-bold">
                  {data?.funnel.conversion_rate}% conversion
                </span>
              </div>
            </div>

            {/* Stage 4: Shares */}
            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-indigo-300 block">4. WhatsApp Shares</span>
                <span className="text-[10px] text-indigo-400/80">Clicked big green share button</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-indigo-400">{data?.funnel.shares}</span>
                <span className="block text-[10px] text-indigo-300 font-bold">
                  {data?.funnel.share_rate}% share rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
