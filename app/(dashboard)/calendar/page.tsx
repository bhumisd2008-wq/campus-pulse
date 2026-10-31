"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Tag,
  Plus,
  X,
  CalendarCheck,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Notice } from "@/types";
import { getNotices } from "@/lib/services/notices";
import { formatFriendlyDate, getNowInIST, isTodayInIST } from "@/lib/utils/dates";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Exams: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", dot: "bg-rose-500" },
  Assignments: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  Workshops: { bg: "bg-violet-50 border-violet-200", text: "text-violet-700", dot: "bg-violet-500" },
  Competitions: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  "Cultural Events": { bg: "bg-pink-50 border-pink-200", text: "text-pink-700", dot: "bg-pink-500" },
  Sports: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  "General Announcements": { bg: "bg-slate-50 border-slate-200", text: "text-slate-700", dot: "bg-slate-500" },
};

export default function CalendarPage() {
  const istNow = getNowInIST();
  const [currentYear, setCurrentYear] = useState(istNow.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(istNow.getMonth()); // 0-indexed
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Load notices from database/storage
  useEffect(() => {
    async function fetchCalendarData() {
      try {
        setLoading(true);
        const data = await getNotices();
        setNotices(data);
      } catch (err) {
        console.error("Error loading calendar notices:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendarData();
  }, []);

  // Compute calendar days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: currentMonth - 1,
        year: currentYear,
        isCurrentMonth: false,
        dateStr: `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
          daysInPrevMonth - i
        ).padStart(2, "0")}`,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        dateStr,
      });
    }

    // Next month padding to fill grid to 35 or 42
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: currentMonth + 1,
        year: currentYear,
        isCurrentMonth: false,
        dateStr: `${currentYear}-${String(currentMonth + 2).padStart(2, "0")}-${String(
          i
        ).padStart(2, "0")}`,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Group notices by YYYY-MM-DD
  const noticesByDate = useMemo(() => {
    const map: Record<string, Notice[]> = {};
    for (const n of notices) {
      if (n.event_date) {
        if (!map[n.event_date]) map[n.event_date] = [];
        map[n.event_date].push(n);
      }
    }
    return map;
  }, [notices]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentMonth(istNow.getMonth());
    setCurrentYear(istNow.getFullYear());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Academic Calendar</h1>
            <p className="text-xs text-slate-500">
              Real-time schedule of examinations, workshops, deadlines and campus events
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleJumpToToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold px-3 text-slate-800 min-w-[120px] text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            href="/notices/new"
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md hover:scale-[1.02] transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Link>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Category Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Categories:
          </span>
          {Object.entries(CATEGORY_COLORS).map(([cat, style]) => (
            <span key={cat} className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
              {cat}
            </span>
          ))}
        </div>

        {/* Calendar Grid Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/60 text-center text-xs font-bold text-slate-500 py-3">
            {DAY_NAMES.map((name) => (
              <div key={name}>{name}</div>
            ))}
          </div>

          {/* Month Days */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {calendarDays.map((d, idx) => {
              const dayNotices = noticesByDate[d.dateStr] || [];
              const isToday = isTodayInIST(d.dateStr);

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] sm:min-h-[130px] p-2 flex flex-col justify-between transition-colors ${
                    !d.isCurrentMonth
                      ? "bg-slate-50/30 text-slate-400"
                      : isToday
                      ? "bg-amber-50/30"
                      : "bg-white hover:bg-slate-50/50"
                  }`}
                >
                  {/* Date Number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-amber-500 text-white shadow-xs"
                          : d.isCurrentMonth
                          ? "text-slate-800"
                          : "text-slate-400"
                      }`}
                    >
                      {d.day}
                    </span>

                    {dayNotices.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                        {dayNotices.length}
                      </span>
                    )}
                  </div>

                  {/* Events on this day */}
                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[80px]">
                    {dayNotices.slice(0, 3).map((notice) => {
                      const color = CATEGORY_COLORS[notice.category] || CATEGORY_COLORS["General Announcements"];
                      return (
                        <button
                          key={notice.id}
                          onClick={() => setSelectedNotice(notice)}
                          className={`w-full text-left p-1 rounded-md text-[10px] font-semibold truncate border flex items-center gap-1 transition-transform hover:scale-[1.01] ${color.bg} ${color.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${color.dot}`} />
                          <span className="truncate">{notice.title}</span>
                        </button>
                      );
                    })}

                    {dayNotices.length > 3 && (
                      <button
                        onClick={() => setSelectedNotice(dayNotices[0])}
                        className="text-[10px] font-bold text-slate-500 hover:text-blue-600 pl-1 block"
                      >
                        +{dayNotices.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {selectedNotice.category}
              </span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {selectedNotice.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                {selectedNotice.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-900">
                  {formatFriendlyDate(selectedNotice.event_date)}
                </span>
                {selectedNotice.event_time && <span>at {selectedNotice.event_time}</span>}
              </div>

              {selectedNotice.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{selectedNotice.venue}</span>
                </div>
              )}

              {selectedNotice.registration_deadline && (
                <div className="flex items-center gap-2 text-rose-600 font-semibold">
                  <CalendarCheck className="h-4 w-4 shrink-0" />
                  <span>Register before {formatFriendlyDate(selectedNotice.registration_deadline)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Link
                href="/notices"
                className="px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200"
              >
                View in Notices
              </Link>
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
