"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Clock,
  Bell,
  Calendar,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  Key,
  Play,
  ChevronRight,
  BookOpen,
  Award,
  Activity,
  Info,
  RefreshCw,
} from "lucide-react";

const PAST_SUMMARIES = [
  {
    week: "Oct 21 – Oct 27, 2026",
    generatedAt: "Monday, Oct 28 • 07:00 AM",
    highlights: [
      "Mid-term examination datesheet released for all departments — check your respective slots.",
      "Annual Hackathon 2026 registrations opened; CS students encouraged to form teams by Oct 30.",
      "Library reading rooms extended to 24/7 mode starting exam week.",
      "Fee payment deadline approaching on November 5th — ensure payment via portal.",
    ],
    stats: { notices: 12, events: 5, deadlines: 3 },
    urgentItem:
      "Mid-term examinations begin Nov 2nd — check your schedule immediately.",
  },
  {
    week: "Oct 14 – Oct 20, 2026",
    generatedAt: "Monday, Oct 21 • 07:00 AM",
    highlights: [
      "University Sports Day registration opened — sign up for at least one event.",
      "National Scholarship Portal open until Nov 15; gather required documents.",
      "Convocation ceremony details published — final year students collect gowns.",
      "AWS Cloud workshop confirmed for Nov 3; limited seats, register early.",
    ],
    stats: { notices: 9, events: 4, deadlines: 2 },
    urgentItem:
      "Convocation gown collection: Administrative block, 10AM-4PM this week only.",
  },
];

const CAPABILITIES = [
  {
    icon: Bell,
    title: "Announcements Digest",
    description: "Summarizes all published notices into top 5 critical action items.",
    color: "text-blue-600 bg-blue-50",
    statusColor: "text-amber-700 bg-amber-100",
  },
  {
    icon: Calendar,
    title: "Event Timeline Summary",
    description: "Compiles upcoming events in chronological order with venue details.",
    color: "text-violet-600 bg-violet-50",
    statusColor: "text-amber-700 bg-amber-100",
  },
  {
    icon: CheckSquare,
    title: "Deadline Extraction",
    description: "Automatically identifies submission dates and deadlines from notice text.",
    color: "text-emerald-600 bg-emerald-50",
    statusColor: "text-amber-700 bg-amber-100",
  },
  {
    icon: TrendingUp,
    title: "Priority Ranking",
    description: "Ranks items by urgency using AI to surface what needs attention first.",
    color: "text-rose-600 bg-rose-50",
    statusColor: "text-amber-700 bg-amber-100",
  },
];

export default function SummaryPage() {
  const [generating, setGenerating] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  const handleGenerate = () => {
    setGenerating(true);
    setShowStatus(false);
    setTimeout(() => {
      setGenerating(false);
      setShowStatus(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">AI Weekly Summary</h1>
            <p className="text-xs text-slate-500">Powered by Google Gemini AI</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all disabled:opacity-70"
        >
          {generating ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate This Week
            </>
          )}
        </button>
      </div>

      <div className="p-6 max-w-5xl space-y-6">
        {/* Hero Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2d1b69] to-[#0f172a] rounded-2xl p-6 sm:p-8 shadow-2xl border border-violet-900/50">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                  AI Campus Briefing Engine
                </p>
                <p className="text-[10px] text-slate-400">
                  Gemini 2.5 Flash • Next.js Server Actions
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Weekly Campus Intelligence</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xl">
              Gemini AI reads all campus announcements, events, and deadline data to generate a
              personalized weekly digest — surfacing what's most important for your department and
              semester.
            </p>

            {showStatus && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 mb-5">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-300 font-semibold text-sm mb-1">
                      Gemini API Key Required
                    </p>
                    <p className="text-amber-200/70 text-xs leading-relaxed">
                      To activate real AI generation, add your Gemini API key in{" "}
                      <span className="font-bold text-amber-300">Settings → AI Integration</span>.
                      The AI engine is fully built and ready — it only needs the key to make live
                      API calls.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-violet-500/20 transition-all disabled:opacity-70 text-sm"
              >
                {generating ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Generate This Week's Briefing
                  </>
                )}
              </button>
              <a
                href="/settings"
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors text-sm"
              >
                <Key className="h-4 w-4" />
                Configure API Key
              </a>
            </div>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all"
              >
                <div
                  className={`h-10 w-10 rounded-xl ${cap.color} flex items-center justify-center mb-3`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{cap.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{cap.description}</p>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${cap.statusColor}`}
                >
                  ⚙️ Needs API Key
                </span>
              </div>
            );
          })}
        </div>

        {/* Past Summaries */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-violet-600" />
            Previously Generated Summaries
          </h2>
          <div className="space-y-4">
            {PAST_SUMMARIES.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Week of {s.week}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      Generated {s.generatedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Bell className="h-3.5 w-3.5" />
                        {s.stats.notices} notices
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {s.stats.events} events
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckSquare className="h-3.5 w-3.5" />
                        {s.stats.deadlines} deadlines
                      </span>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        expanded === i ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {expanded === i && (
                  <div className="border-t border-slate-100 px-6 py-5 space-y-4">
                    {s.urgentItem && (
                      <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
                        <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-rose-700 mb-0.5 uppercase tracking-wide">
                            Urgent Highlight
                          </p>
                          <p className="text-sm text-rose-800">{s.urgentItem}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                        AI-Generated Key Highlights
                      </p>
                      <div className="space-y-2.5">
                        {s.highlights.map((h, j) => (
                          <div key={j} className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[9px] font-bold text-white">{j + 1}</span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{h}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
