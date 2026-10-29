"use client";

import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Flame,
  Award,
  Layers,
  FileText,
} from "lucide-react";

interface KitMessage {
  id: string;
  branch: string;
  tone: "Outcome-Led" | "FOMO-Led" | "Placement-Led";
  charCount: number;
  message: string;
}

const CHAMPION_MESSAGES: KitMessage[] = [
  {
    id: "cse-outcome",
    branch: "Computer Science & IT",
    tone: "Outcome-Led",
    charCount: 312,
    message: `Final-years: every tech interview asks "what have you built with AI?" 

NxtWave is hosting a free hands-on workshop: "Build Your First AI Project in 60 Minutes". We build and deploy a working AI project live in Google Colab to showcase on our resumes.

Join our college squad link so our campus leads the board:
{{LINK}}`,
  },
  {
    id: "ece-outcome",
    branch: "ECE & Electronics",
    tone: "Outcome-Led",
    charCount: 338,
    message: `ECE 2027 batch: AI isn't just for software anymore—embedded AI & TinyML are coming up in every core and hybrid placement drive.

Free 60-min hands-on build session by NxtWave: "Build Your First AI Project". Zero prior coding required. You leave with an actual project to demo.

Support our college squad on the live leaderboard here:
{{LINK}}`,
  },
  {
    id: "eee-placement",
    branch: "EEE & Electrical",
    tone: "Placement-Led",
    charCount: 326,
    message: `EEE classmates: if your final-year project needs an AI component (smart grids, EV battery predictive ML), check this out.

NxtWave is doing a free 60-min build workshop: "Build Your First AI Project". Hands-on, certificate on completion, and a working demo for drives.

Register in 20 seconds through our college squad link:
{{LINK}}`,
  },
  {
    id: "mech-fomo",
    branch: "Mechanical Engineering",
    tone: "FOMO-Led",
    charCount: 318,
    message: `Mech folks: smart manufacturing and predictive AI are big on campus drive resumes this season.

NxtWave is running a free 60-min workshop to build a working AI project from scratch. No complex coding needed.

Our college is currently racing against other engineering campuses on the leaderboard:
{{LINK}}`,
  },
  {
    id: "general-fomo",
    branch: "All Branches / Class Group",
    tone: "FOMO-Led",
    charCount: 298,
    message: `Attention 2027 batch: our college is competing in the NxtWave Squad Race! 

Free 60-minute hands-on build: "Build Your First AI Project". We leave with a working project to demo in interviews. Takes 20 seconds to register.

Score a point for our college by joining through our squad link:
{{LINK}}`,
  },
];

const POSTER_COPY = `🚀 FINAL-YEAR PLACEMENT AI ACCELERATOR (2027 BATCH)
"Build Your First AI Project in 60 Minutes"
📅 Live Hands-On Session • Sunday 6:00 PM IST
⚡ Zero AI experience required • Google Colab • 100% Free
🏆 Put your college at #1 on the Squad Race Leaderboard
👉 Register in 20 seconds: {{LINK}}`;

export default function ChampionKitPage() {
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const branches = ["All", "Computer Science & IT", "ECE & Electronics", "EEE & Electrical", "Mechanical Engineering"];

  const filteredMessages =
    selectedBranch === "All"
      ? CHAMPION_MESSAGES
      : CHAMPION_MESSAGES.filter((m) => m.branch === selectedBranch || m.branch.includes("All"));

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Campus Distribution Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Campus Champion Kit
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          High-conversion, human-reviewed WhatsApp messages and poster captions tailored per engineering branch. All messages are under 450 characters and strictly adhere to brand safety guidelines.
        </p>
      </div>

      {/* Guidelines Box */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-2 text-xs text-slate-300">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-emerald-400" />
          Guidelines for Campus Champions
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-400">
          <li>Never spam or blast unknown contacts. Share only in class, branch, or placement groups you belong to.</li>
          <li>Replace <code className="text-emerald-400 font-mono font-bold">{`{{LINK}}`}</code> with your personal squad link from your Squad Card.</li>
          <li>Make only verified claims: 60 minutes, free, hands-on project build, certificate upon verified completion.</li>
        </ul>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {branches.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBranch(b)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedBranch === b
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* WhatsApp Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  {msg.branch}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {msg.tone} • {msg.charCount} chars
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {msg.message}
              </div>
            </div>

            <button
              onClick={() => handleCopy(msg.id, msg.message)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedId === msg.id ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy WhatsApp Message</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Official Poster Copy */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Ready-to-Post Circular / Poster Caption</span>
          </h3>
          <span className="text-xs text-slate-500">Placement Cells & Club Broadcasts</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono">
          {POSTER_COPY}
        </div>

        <button
          onClick={() => handleCopy("poster", POSTER_COPY)}
          className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {copiedId === "poster" ? (
            <>
              <Check className="w-4 h-4 text-slate-950" />
              <span>Poster Caption Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Poster Caption</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
