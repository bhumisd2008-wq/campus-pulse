"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  CheckSquare,
  Sparkles,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Database,
  HardDrive,
  CalendarDays,
  Zap,
} from "lucide-react";
import { Notice } from "@/types";
import { getNotices, isSupabaseConfigured } from "@/lib/services/notices";
import {
  getNowInIST,
  formatFriendlyDate,
  isTodayInIST,
  computeEventStatus,
} from "@/lib/utils/dates";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const isSupa = isSupabaseConfigured();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // Format today's date in IST
  const todayFormatted = getNowInIST().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await getNotices();
        setNotices(data);
      } catch (err) {
        console.error("Dashboard notices error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Compute stats dynamically from actual records
  const totalNotices = notices.length;
  const upcomingEvents = notices.filter(
    (n) => n.event_date && computeEventStatus(n.event_date, n.event_time) === "upcoming"
  );
  const urgentItems = notices.filter((n) => n.priority === "urgent");
  const todayEvents = notices.filter((n) => isTodayInIST(n.event_date));
  const expiredNotices = notices.filter((n) => n.priority === "expired");
  const recentNotices = notices.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Academic Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            {todayFormatted} (IST)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/summary"
            className="hidden sm:flex items-center gap-2 border border-violet-300 text-violet-700 bg-violet-50 text-xs font-bold px-4 py-2 rounded-xl hover:bg-violet-100 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            AI Weekly Summary
          </Link>

          <Link
            href="/notices/new"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Notice</span>
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#1e293b] rounded-3xl p-6 sm:p-8 shadow-xl text-white">
          <div className="absolute top-0 right-0 h-full w-72 bg-gradient-to-l from-blue-600/15 to-transparent pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full">
              {isSupa ? (
                <>
                  <Database className="h-3.5 w-3.5 text-emerald-400" />
                  Supabase Cloud Connected
                </>
              ) : (
                <>
                  <HardDrive className="h-3.5 w-3.5 text-blue-400" />
                  Local Development Storage Active
                </>
              )}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Hello, <span className="text-blue-400">{user?.fullName || "Student"}!</span> 👋
              </h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
                You have <span className="font-bold text-white">{urgentItems.length} urgent items</span> requiring attention and{" "}
                <span className="font-bold text-white">{upcomingEvents.length} events scheduled</span> in your calendar.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href="/notices/new"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:scale-[1.02] transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Notice with AI
              </Link>
              <Link
                href="/notices"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-colors"
              >
                <Bell className="h-4 w-4" />
                View All Notices ({totalNotices})
              </Link>
              <Link
                href="/calendar"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                Open Calendar
              </Link>
              <Link
                href="/reminders"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-colors"
              >
                <CheckSquare className="h-4 w-4" />
                Deadlines & Reminders
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Real Statistics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                All Time
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">
              {loading ? "..." : totalNotices}
            </div>
            <div className="text-xs font-medium text-slate-500">Total Notices Saved</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                Scheduled
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">
              {loading ? "..." : upcomingEvents.length}
            </div>
            <div className="text-xs font-medium text-slate-500">Upcoming Events</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                &lt; 24h
              </span>
            </div>
            <div className="text-3xl font-extrabold text-rose-600 mb-1">
              {loading ? "..." : urgentItems.length}
            </div>
            <div className="text-xs font-medium text-slate-500">Urgent Deadlines</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CalendarDays className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Today
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">
              {loading ? "..." : todayEvents.length}
            </div>
            <div className="text-xs font-medium text-slate-500">Events Today</div>
          </div>
        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Notices (col-span-2) */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recently Added Notices</h3>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <Link
                  href="/notices"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : recentNotices.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No notices available. Click &quot;Add Notice&quot; to publish your first one.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentNotices.map((notice) => (
                    <Link
                      key={notice.id}
                      href="/notices"
                      className="flex items-start justify-between gap-4 p-5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {notice.category}
                          </span>
                          {notice.priority === "urgent" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                              Urgent
                            </span>
                          )}
                          {isTodayInIST(notice.event_date) && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                              Today
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {notice.title}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-1">
                          {notice.description}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          {notice.event_date && (
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <Calendar className="h-3 w-3 text-blue-500" />
                              {formatFriendlyDate(notice.event_date)}
                            </span>
                          )}
                          {notice.venue && (
                            <span>• {notice.venue}</span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 shrink-0 self-center transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* AI Summary Banner Promo */}
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] rounded-2xl p-6 text-white border border-violet-900/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wide">
                    Gemini Intelligence
                  </span>
                </div>
                <h4 className="text-base font-bold">What do you need to know this week?</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Gemini analyzes all published notices to generate an executive briefing with examinations, assignment deadlines, and action items.
                </p>
              </div>

              <Link
                href="/summary"
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg hover:scale-[1.02] transition-all shrink-0"
              >
                <Zap className="h-3.5 w-3.5" />
                Generate Briefing
              </Link>
            </div>
          </div>

          {/* Right Column: Urgent Deadlines & Calendar Quickview */}
          <div className="space-y-4">
            {/* Urgent Items List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-900">Urgent Deadlines</h3>
                </div>
                <Link
                  href="/reminders"
                  className="text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  Manage
                </Link>
              </div>

              {urgentItems.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No urgent deadlines in the next 24 hours. Great job staying ahead! 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {urgentItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-rose-100 bg-rose-50/50 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-700 uppercase">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold text-rose-600">
                          {item.registration_deadline
                            ? formatFriendlyDate(item.registration_deadline)
                            : formatFriendlyDate(item.event_date)}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Quick Shortcuts
              </h3>
              <Link
                href="/calendar"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Monthly Calendar View
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                href="/reminders"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-violet-600" />
                  Task & Assignment Reminders
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                href="/settings"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-600" />
                  Supabase & Gemini Settings
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
