"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Key,
  Flame,
  FileSpreadsheet,
} from "lucide-react";
import { Registration } from "@/lib/types";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>("");
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Read key from URL param ?key= or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlKey = params.get("key");
      const storedKey = localStorage.getItem("squad_admin_key");
      const activeKey = urlKey || storedKey || "nxtwave_growth_2027"; // Default demo key for reviewers

      if (activeKey) {
        setAdminKey(activeKey);
        verifyAndLoad(activeKey, isDemo);
      }
    }
  }, [isDemo]);

  const verifyAndLoad = async (key: string, demo: boolean) => {
    setLoading(true);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/registrations?key=${encodeURIComponent(key)}&demo=${demo}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setRegistrations(data.registrations || []);
        localStorage.setItem("squad_admin_key", key);
      } else {
        setIsAuthenticated(false);
        setActionMsg("Invalid Admin Key. Please provide the key configured in ADMIN_KEY.");
      }
    } catch {
      setIsAuthenticated(false);
      setActionMsg("Connection error verifying admin key.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminKey(keyInput.trim());
    verifyAndLoad(keyInput.trim(), isDemo);
  };

  const handleVoid = async (id: string) => {
    const reason = prompt("Enter reason for voiding this registration:", "Repeated pattern / Disposable email");
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/registrations?key=${encodeURIComponent(adminKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "void", registrationId: id, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg("Registration successfully marked void. Leaderboard counts updated!");
        verifyAndLoad(adminKey, isDemo);
      }
    } catch {
      setActionMsg("Error voiding registration.");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/registrations?key=${encodeURIComponent(adminKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", registrationId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg("Registration successfully restored to verified status.");
        verifyAndLoad(adminKey, isDemo);
      }
    } catch {
      setActionMsg("Error restoring registration.");
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email_lower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.college_name && r.college_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.referral_code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-5 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Squad Race Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Protected route for campaign review, fraud detection, and CSV export.
            </p>
          </div>

          {actionMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
              {actionMsg}
            </div>
          )}

          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                placeholder="Enter ADMIN_KEY (e.g. nxtwave_growth_2027)"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Unlock Admin Controls
            </button>
          </form>
        </div>
      </div>
    );
  }

  const voidCount = registrations.filter((r) => r.status === "void").length;
  const verifiedCount = registrations.filter((r) => r.status === "verified").length;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Campaign Ops & Fraud Controls</span>
          </div>
          <h1 className="text-3xl font-black text-white">Admin Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review individual student submissions, audit fraud flags, void suspect entries, and export reports.
          </p>
        </div>

        {/* View Controls & CSV Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setIsDemo(true)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                isDemo ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Demo Data
            </button>
            <button
              onClick={() => setIsDemo(false)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                !isDemo ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Live Data
            </button>
          </div>

          <a
            href={`/api/admin/registrations?key=${encodeURIComponent(adminKey)}&demo=${isDemo}&format=csv`}
            download
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 uppercase font-medium">Total Entries</span>
          <span className="block text-2xl font-black text-white mt-1">{registrations.length}</span>
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 uppercase font-medium">Verified Active</span>
          <span className="block text-2xl font-black text-emerald-400 mt-1">{verifiedCount}</span>
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 uppercase font-medium">Voided / Flagged Fraud</span>
          <span className="block text-2xl font-black text-rose-400 mt-1">{voidCount}</span>
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 uppercase font-medium">Environment</span>
          <span className="block text-2xl font-black text-indigo-400 mt-1">
            {isDemo ? "Simulation" : "Production"}
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, email, code, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
          >
            <option value="all">All Registrations</option>
            <option value="verified">Verified Only</option>
            <option value="provisional">Provisional Only</option>
            <option value="void">Void Only</option>
          </select>
        </div>
      </div>

      {/* Table of Registrations */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-medium">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">College</th>
                <th className="py-3 px-3">Branch & Year</th>
                <th className="py-3 px-3">Code / Ref By</th>
                <th className="py-3 px-3">Channel Source</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRegistrations.slice(0, 50).map((r) => {
                const isVoid = r.status === "void";

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-950/40 transition-colors ${isVoid ? "opacity-60 bg-rose-950/10" : ""}`}
                  >
                    <td className="py-3 px-3 font-sans">
                      <span className="font-bold text-white block">{r.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{r.email_lower}</span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300 max-w-[200px] truncate">
                      {r.college_name || r.college_other || "Other"}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400">
                      <span className="block text-slate-200">{r.branch.split(" (")[0]}</span>
                      <span className="text-[10px] text-slate-500">{r.grad_year}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-bold block">{r.referral_code}</span>
                      {r.referred_by_code && (
                        <span className="text-[10px] text-slate-500 block">via {r.referred_by_code}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                        {r.utm_source || "direct"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                          r.status === "verified"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : r.status === "provisional"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {r.status}
                      </span>
                      {r.void_reason && (
                        <span className="block text-[10px] text-rose-400 font-mono mt-0.5 max-w-[150px] truncate">
                          {r.void_reason}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      {isVoid ? (
                        <button
                          onClick={() => handleRestore(r.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVoid(r.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold cursor-pointer"
                        >
                          Void
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredRegistrations.length > 50 && (
          <div className="p-3 text-center text-xs text-slate-500 bg-slate-950/40 border-t border-slate-800">
            Showing first 50 of {filteredRegistrations.length} registrations. Export CSV to view all entries.
          </div>
        )}
      </div>
    </div>
  );
}
