"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Tag,
  Filter,
  GraduationCap,
  Zap,
  Megaphone,
  Trophy,
  BookOpen,
  Music,
  X,
} from "lucide-react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENTS = [
  { id: "1", title: "Distributed Systems Midterm", date: "2026-11-02", time: "09:00 AM - 12:00 PM", venue: "Exam Hall A, Block 3", type: "examination", attendees: 87, organizer: "Examination Cell", description: "Theory examination for CS402. Students must bring college ID and hall ticket." },
  { id: "2", title: "AI & Prompt Engineering Workshop", date: "2026-11-03", time: "02:00 PM - 05:00 PM", venue: "Seminar Hall, Ground Floor", type: "workshop", attendees: 65, organizer: "CS Club", description: "Hands-on session on prompt design, LLM fine-tuning basics, and building agents." },
  { id: "3", title: "Annual Sports Day Registration", date: "2026-11-04", time: "10:00 AM - 04:00 PM", venue: "Sports Complex", type: "event", attendees: 200, organizer: "Sports Committee", description: "Register for track events, basketball, football, and badminton before noon." },
  { id: "4", title: "Fee Payment Deadline", date: "2026-11-05", time: "11:59 PM", venue: "Accounts Section / Online Portal", type: "deadline", attendees: 1200, organizer: "Accounts & Finance", description: "Last date for semester fee payment. Late fee of ₹500/day will be applicable after this date." },
  { id: "5", title: "Guest Lecture: Blockchain in Finance", date: "2026-11-07", time: "11:00 AM - 01:00 PM", venue: "Auditorium Hall B", type: "seminar", attendees: 150, organizer: "Economics Dept.", description: "Industry expert from ICICI Bank will cover DeFi, smart contracts, and crypto regulation." },
  { id: "6", title: "Cultural Night: TechFest 2026", date: "2026-11-08", time: "06:00 PM - 10:00 PM", venue: "Main Grounds", type: "cultural", attendees: 800, organizer: "Student Council", description: "Musical performances, stand-up comedy, and dance competitions. Open to all students and faculty." },
  { id: "7", title: "Python for Data Science — Bootcamp Day 1", date: "2026-11-10", time: "09:00 AM - 05:00 PM", venue: "CS Lab 3, Block 2", type: "workshop", attendees: 40, organizer: "Data Science Society", description: "Intensive bootcamp. Bring your own laptop. Pre-install Anaconda & Jupyter before attending." },
  { id: "8", title: "DBMS Lab Practical Exam", date: "2026-11-12", time: "09:00 AM - 11:00 AM", venue: "DB Lab, Block 4", type: "examination", attendees: 60, organizer: "Examination Cell", description: "Practical exam for CS302. SQL queries, normalization problems, and ER diagram design." },
];

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType; dot: string }> = {
  examination: { label: "Examination", color: "text-rose-700", bg: "bg-rose-100", icon: GraduationCap, dot: "bg-rose-500" },
  workshop: { label: "Workshop", color: "text-violet-700", bg: "bg-violet-100", icon: Zap, dot: "bg-violet-500" },
  event: { label: "Event", color: "text-blue-700", bg: "bg-blue-100", icon: Trophy, dot: "bg-blue-500" },
  deadline: { label: "Deadline", color: "text-amber-700", bg: "bg-amber-100", icon: Clock, dot: "bg-amber-500" },
  seminar: { label: "Seminar", color: "text-emerald-700", bg: "bg-emerald-100", icon: BookOpen, dot: "bg-emerald-500" },
  cultural: { label: "Cultural", color: "text-pink-700", bg: "bg-pink-100", icon: Music, dot: "bg-pink-500" },
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const eventsByDate = EVENTS.reduce((acc, evt) => {
    if (!acc[evt.date]) acc[evt.date] = [];
    acc[evt.date].push(evt);
    return acc;
  }, {} as Record<string, typeof EVENTS>);

  const filteredEvents = EVENTS.filter((e) => {
    const d = new Date(e.date);
    const inMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    const matchFilter = filterType === "All" || e.type === filterType.toLowerCase();
    const matchSelected = !selectedDate || e.date === selectedDate;
    return inMonth && matchFilter && matchSelected;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const dateStr = (day: number) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Campus Calendar</h1>
            <p className="text-xs text-slate-500">{EVENTS.length} events this month</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {["All", "Examination", "Workshop", "Event", "Deadline", "Seminar"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === t
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-[1400px]">
        {/* Calendar Grid */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-slate-500 py-3">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] border-b border-r border-slate-50" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const ds = dateStr(day);
              const dayEvents = eventsByDate[ds] || [];
              const isToday =
                ds ===
                `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
                  today.getDate()
                ).padStart(2, "0")}`;
              const isSelected = ds === selectedDate;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : ds)}
                  className={`min-h-[90px] p-2 border-b border-r border-slate-50 cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold mb-1 ${
                      isToday ? "bg-blue-600 text-white" : "text-slate-700"
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((evt) => {
                      const cfg = TYPE_CONFIG[evt.type];
                      return (
                        <button
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(evt);
                          }}
                          className={`w-full text-left text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${cfg.bg} ${cfg.color} truncate`}
                        >
                          <div className={`h-1.5 w-1.5 rounded-full ${cfg.dot} shrink-0`} />
                          <span className="truncate">{evt.title}</span>
                        </button>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <p className="text-[9px] text-slate-400 font-medium px-1">
                        +{dayEvents.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="space-y-4">
          {/* Type Legend */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Event Types</h3>
            <div className="space-y-2">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    <span className="text-xs font-medium text-slate-700">{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filtered Events List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {selectedDate
                  ? `Events on ${new Date(selectedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}`
                  : "Upcoming Events"}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-50 max-h-[480px] overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No events found</p>
                </div>
              ) : (
                filteredEvents.map((evt) => {
                  const cfg = TYPE_CONFIG[evt.type];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`h-4 w-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                            {evt.title}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {evt.time}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {evt.venue}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const cfg = TYPE_CONFIG[selectedEvent.type];
              const Icon = cfg.icon;
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${cfg.color}`} />
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 mb-3">{selectedEvent.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {selectedEvent.description}
                  </p>
                  <div className="space-y-2.5 text-sm text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {selectedEvent.time}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {selectedEvent.venue}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users className="h-4 w-4 text-slate-400" />
                      {selectedEvent.attendees} registered participants
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Tag className="h-4 w-4 text-slate-400" />
                      {selectedEvent.organizer}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-2.5 rounded-xl text-sm">
                      Add to Reminders
                    </button>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
