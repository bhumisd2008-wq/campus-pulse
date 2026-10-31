"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  CheckSquare,
  Sparkles,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  BookOpen,
  Users,
  Activity,
  Megaphone,
  FlaskConical,
  GraduationCap,
  FileText,
  ChevronRight,
  Eye,
  Zap,
} from "lucide-react";

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const STATS = [
  {
    label: "Total Notices",
    value: "48",
    change: "+3 today",
    positive: true,
    icon: Bell,
    gradient: "from-blue-600 to-blue-700",
    shadow: "shadow-blue-500/25",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Upcoming Events",
    value: "12",
    change: "Next in 2 days",
    positive: true,
    icon: Calendar,
    gradient: "from-violet-600 to-violet-700",
    shadow: "shadow-violet-500/25",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    label: "Urgent Deadlines",
    value: "4",
    change: "2 due tomorrow",
    positive: false,
    icon: AlertTriangle,
    gradient: "from-rose-500 to-rose-600",
    shadow: "shadow-rose-500/25",
    bg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    label: "Pending Reminders",
    value: "9",
    change: "3 completed today",
    positive: true,
    icon: CheckSquare,
    gradient: "from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/25",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const RECENT_NOTICES = [
  {
    id: "1",
    title: "Mid-Term Examination Datesheet — Spring 2026",
    department: "Examination Cell",
    time: "2 hours ago",
    category: "examination",
    priority: "urgent",
    icon: GraduationCap,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: "2",
    title: "Annual Hackathon 2026 — Registration Open",
    department: "CS & IT Club",
    time: "5 hours ago",
    category: "event",
    priority: "high",
    icon: FlaskConical,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "3",
    title: "Cloud Architecture Workshop — AWS & GCP",
    department: "Training & Placement Cell",
    time: "1 day ago",
    category: "workshop",
    priority: "medium",
    icon: Megaphone,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    id: "4",
    title: "Library Extended Hours During Exam Week",
    department: "Central Library",
    time: "1 day ago",
    category: "announcement",
    priority: "low",
    icon: BookOpen,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

const UPCOMING_EVENTS = [
  { title: "Distributed Systems Midterm", date: "Nov 02", time: "09:00 AM", type: "exam", color: "bg-rose-500" },
  { title: "AI Workshop: Prompt Engineering", date: "Nov 03", time: "02:00 PM", type: "workshop", color: "bg-violet-500" },
  { title: "Sports Committee Meeting", date: "Nov 04", time: "04:00 PM", type: "meeting", color: "bg-blue-500" },
  { title: "Fee Payment Last Date", date: "Nov 05", time: "11:59 PM", type: "deadline", color: "bg-amber-500" },
];

const URGENT_DEADLINES = [
  { title: "Cloud Computing Lab Report 4", course: "CS501", due: "Tomorrow 11:59 PM", color: "border-l-rose-500" },
  { title: "SE Capstone Milestone 1 — SRS Doc", course: "CS410", due: "Nov 03 11:59 PM", color: "border-l-orange-500" },
  { title: "DBMS Assignment 5", course: "CS302", due: "Nov 04 5:00 PM", color: "border-l-amber-500" },
];

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-rose-100 text-rose-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-slate-100 text-slate-600",
};

export default function DashboardPage() {
  const [summaryGenerating, setSummaryGenerating] = useState(false);
  const [summaryMsg, setSummaryMsg] = useState("");

  const handleGenerateSummary = () => {
    setSummaryGenerating(true);
    setSummaryMsg("");
    setTimeout(() => {
      setSummaryGenerating(false);
      setSummaryMsg("AI Summary feature requires Gemini API key. Configure it in Settings → AI Integration.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {TODAY}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/summary"
            onClick={handleGenerateSummary}
            className="hidden sm:flex items-center gap-2 border border-violet-300 text-violet-700 bg-violet-50 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-100 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Generate Weekly Summary
          </Link>
          <Link
            href="/notices/new"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Add Notice</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1400px]">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="absolute top-0 right-0 h-full w-64 bg-gradient-to-l from-blue-600/10 to-transparent" />
          <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-violet-500/10 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Campus System Online
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Good morning, <span className="text-blue-400">Alex! 👋</span>
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-lg">
              You have <span className="text-white font-semibold">4 urgent deadlines</span> approaching and{" "}
              <span className="text-white font-semibold">3 new notices</span> published since yesterday. Stay on top of it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/notices"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Bell className="h-4 w-4" />
                View All Notices
              </Link>
              <Link
                href="/reminders"
                className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <CheckSquare className="h-4 w-4" />
                Check Deadlines
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.positive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content: 2-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Notices — wider */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recent Notices</h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">48</span>
                </div>
                <Link
                  href="/notices"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-50">
                {RECENT_NOTICES.map((notice) => {
                  const Icon = notice.icon;
                  return (
                    <Link
                      key={notice.id}
                      href={`/notices`}
                      className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors group"
                    >
                      <div className={`h-10 w-10 rounded-xl ${notice.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`h-5 w-5 ${notice.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                            {notice.title}
                          </p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_COLORS[notice.priority]}`}>
                            {notice.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>{notice.department}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{notice.time}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
                    </Link>
                  );
                })}
              </div>

              <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100">
                <Link
                  href="/notices/new"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Publish New Notice
                </Link>
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] rounded-2xl p-6 border border-violet-900/50 shadow-xl">
              <div className="absolute top-0 right-0 h-40 w-40 bg-violet-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">AI Weekly Briefing</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Generate This Week's Summary</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Let Gemini AI synthesize all campus announcements, events, and deadlines into a crisp, personalized weekly digest.
                </p>
                {summaryMsg && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-4">
                    <p className="text-amber-300 text-xs leading-relaxed">{summaryMsg}</p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerateSummary}
                    disabled={summaryGenerating}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-violet-500/20 transition-all disabled:opacity-70"
                  >
                    {summaryGenerating ? (
                      <>
                        <Activity className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Generate Summary
                      </>
                    )}
                  </button>
                  <Link
                    href="/summary"
                    className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                  >
                    View past summaries →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  <h3 className="text-sm font-bold text-slate-900">Upcoming Events</h3>
                </div>
                <Link href="/calendar" className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                  Calendar <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="p-4 space-y-3">
                {UPCOMING_EVENTS.map((evt) => (
                  <div key={evt.title} className="flex items-center gap-3 group">
                    <div className={`h-10 w-10 rounded-xl ${evt.color} flex flex-col items-center justify-center shrink-0`}>
                      <span className="text-white text-[10px] font-bold leading-none">{evt.date.split(" ")[0]}</span>
                      <span className="text-white text-[10px] leading-none">{evt.date.split(" ")[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {evt.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{evt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <Link
                  href="/calendar"
                  className="flex items-center justify-center gap-1.5 w-full border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  View Full Calendar <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Urgent Deadlines */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <h3 className="text-sm font-bold text-slate-900">Urgent Deadlines</h3>
                  <span className="h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                </div>
                <Link href="/reminders" className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                  All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="p-4 space-y-3">
                {URGENT_DEADLINES.map((d) => (
                  <div key={d.title} className={`border-l-4 ${d.color} bg-slate-50 rounded-r-xl pl-3 pr-3 py-2.5`}>
                    <p className="text-xs font-semibold text-slate-800 truncate">{d.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span className="font-medium text-blue-600">{d.course}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3 text-rose-400" />
                        {d.due}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <Link
                  href="/reminders"
                  className="flex items-center justify-center gap-1.5 w-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Reminder
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-blue-600 to-violet-700 rounded-2xl p-5 shadow-xl shadow-blue-500/20">
              <h3 className="text-sm font-bold text-white mb-3">Quick Navigation</h3>
              <div className="space-y-2">
                {[
                  { href: "/notices/new", label: "Publish Notice", icon: Plus, desc: "Create & post" },
                  { href: "/notices", label: "Browse Notices", icon: Eye, desc: "48 active" },
                  { href: "/settings", label: "Settings", icon: Zap, desc: "Configure AI & profile" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2.5 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.label}</p>
                        <p className="text-[10px] text-blue-200">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
