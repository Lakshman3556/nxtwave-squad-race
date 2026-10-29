import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "NxtWave Squad Race | Build Your First AI Project in 60 Minutes",
  description:
    "Free hands-on AI workshop for final-year engineering students (2027 batch). Build a demoable AI project in 60 minutes and climb the college leaderboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto space-y-2">
            <p>
              NxtWave Growth Challenge Round 1 Submission • Candidate: Lakshman (B.E. IT Student, Hyderabad)
            </p>
            <p className="text-slate-600">
              Simulation environment: All demo metrics clearly isolated. No unauthorized personal data stored.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
