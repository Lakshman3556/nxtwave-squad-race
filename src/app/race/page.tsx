"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Flame,
  Search,
  Building,
  Sparkles,
  RefreshCw,
  Award,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { CollegeLeaderboardItem, IndividualLeaderboardItem } from "@/lib/types";

export default function LeaderboardPage() {
  const [colleges, setColleges] = useState<CollegeLeaderboardItem[]>([]);
  const [individuals, setIndividuals] = useState<IndividualLeaderboardItem[]>([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeaderboard = (demoMode: boolean) => {
    fetch(`/api/leaderboard?demo=${demoMode}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setColleges(json.data.colleges || []);
          setIndividuals(json.data.individuals || []);
          setTotalRegistrations(json.data.totalRegistrations || 0);
          setLastUpdated(new Date().toLocaleTimeString());
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard(isDemo);

    // Auto polling every 10 seconds (P0 requirement)
    const interval = setInterval(() => {
      fetchLeaderboard(isDemo);
    }, 10000);

    return () => clearInterval(interval);
  }, [isDemo]);

  const filteredColleges = colleges.filter((c) =>
    c.college_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Simulation Banner if demo mode is enabled */}
      {isDemo && (
        <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-4 text-center text-xs text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>
              <strong>SIMULATION:</strong> Displaying demo data to showcase full leaderboard state. (Real campaign results are unpopulated).
            </span>
          </div>
          <button
            onClick={() => setIsDemo(false)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer shrink-0"
          >
            Switch to Live Real Signups
          </button>
        </div>
      )}

      {/* Header & Goal Counter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Flame className="w-4 h-4 text-indigo-400" />
            <span>College vs College Referral Race</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Campus Leaderboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Real-time standings of engineering colleges and top student champions. Auto-refreshes every 10 seconds.
          </p>
        </div>

        {/* Live Counter & Toggle Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex items-center gap-4 shadow-inner">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Live Cohort Progress
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white">{totalRegistrations}</span>
                <span className="text-slate-500 font-semibold text-sm">/ 500 Goal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setIsDemo(true)}
              className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                isDemo
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Demo Data
            </button>
            <button
              onClick={() => setIsDemo(false)}
              className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                !isDemo
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Live Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Colleges Race + Top Individuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Colleges Ranking */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              <span>Colleges Competing ({filteredColleges.length})</span>
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search college or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading standings...</div>
          ) : filteredColleges.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
              No colleges found matching search.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredColleges.map((col, index) => {
                const isTop3 = col.rank <= 3;
                let rankBadgeBg = "bg-slate-950 text-slate-400 border-slate-800";
                if (col.rank === 1) rankBadgeBg = "bg-amber-400/20 text-amber-300 border-amber-400/40";
                if (col.rank === 2) rankBadgeBg = "bg-slate-300/20 text-slate-200 border-slate-300/40";
                if (col.rank === 3) rankBadgeBg = "bg-amber-700/20 text-amber-400 border-amber-700/40";

                return (
                  <div
                    key={col.college_id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isTop3
                        ? "bg-slate-900/90 border-slate-700 shadow-lg shadow-black/20"
                        : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Rank Number */}
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm shrink-0 ${rankBadgeBg}`}
                      >
                        {col.rank === 1 ? "🥇" : col.rank === 2 ? "🥈" : col.rank === 3 ? "🥉" : `#${col.rank}`}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{col.college_name}</h4>
                        <p className="text-xs text-slate-400">
                          {col.city}, {col.state}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-emerald-400">{col.count}</span>
                      <span className="block text-[10px] text-slate-500 font-medium uppercase">
                        Registered
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Top Student Champions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Top 10 Referrers</span>
            </h2>
            <span className="text-[11px] text-slate-500">₹1,000 Voucher Pool</span>
          </div>

          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 space-y-3 shadow-xl">
            <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              Vouchers awarded to top 3 verified referrers (₹500 / ₹300 / ₹200) after workshop attendance is verified.
            </div>

            {individuals.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No referrals recorded yet in this mode.
              </div>
            ) : (
              <div className="space-y-2">
                {individuals.map((ind) => (
                  <div
                    key={ind.referral_code}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          ind.rank === 1
                            ? "bg-amber-400/20 text-amber-300"
                            : ind.rank === 2
                            ? "bg-slate-300/20 text-slate-200"
                            : ind.rank === 3
                            ? "bg-amber-700/20 text-amber-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {ind.rank}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {ind.first_name}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {ind.college_name.split(" (")[0]}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-400">
                        {ind.referrals_count}
                      </span>
                      <span className="text-[10px] text-slate-500 block">friends</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Get Your Squad Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
