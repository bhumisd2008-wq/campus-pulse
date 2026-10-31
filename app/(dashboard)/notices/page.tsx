"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Filter,
  Plus,
  Pin,
  Calendar,
  Tag,
  Clock,
  ChevronRight,
  Eye,
  Share2,
  Bookmark,
  AlertTriangle,
  Info,
  CheckCircle,
  GraduationCap,
  Megaphone,
  FlaskConical,
  BookOpen,
  Award,
  X,
  SlidersHorizontal,
} from "lucide-react";

const NOTICES = [
  {
    id: "1",
    title: "Mid-Term Examination Datesheet — Spring Semester 2026",
    content: "The finalized datesheet for all mid-term theoretical and practical examinations has been published. Students must carry valid college identity cards. Mobile phones are strictly prohibited inside examination halls. Late entries will not be permitted after 15 minutes.",
    department: "Examination Cell",
    date: "Oct 28, 2026",
    category: "examination",
    priority: "urgent",
    pinned: true,
    views: 1240,
    icon: GraduationCap,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    tags: ["All Departments", "Important"],
  },
  {
    id: "2",
    title: "Annual Campus Hackathon 2026 — Registration Deadline Extended",
    content: "Due to overwhelming response, registration for Campus Hack 2026 has been extended by 5 days. Form teams of 3-4 members and register on the campus portal. Prize pool: ₹1,00,000. Guest mentors from Google, Microsoft, and Zepto confirmed.",
    department: "CS & IT Club",
    date: "Oct 27, 2026",
    category: "event",
    priority: "high",
    pinned: true,
    views: 876,
    icon: FlaskConical,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    tags: ["CS/IT", "Registration Open"],
  },
  {
    id: "3",
    title: "Cloud Architecture & DevOps Workshop — AWS & GCP Certification Prep",
    content: "A comprehensive hands-on workshop covering AWS Solutions Architect concepts and Google Cloud Platform fundamentals. Certificate of completion will be issued. Industry trainers from Infosys BPM will conduct the sessions.",
    department: "Training & Placement Cell",
    date: "Oct 26, 2026",
    category: "workshop",
    priority: "high",
    pinned: false,
    views: 534,
    icon: Megaphone,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    tags: ["CS/IT", "Career"],
  },
  {
    id: "4",
    title: "Library Reading Rooms Extended — 24/7 During Examination Period",
    content: "The central library reading rooms will operate 24 hours daily starting next Monday until the end of examination week. Students must carry their library card for entry after 10 PM. The silent reading zone will be strictly enforced.",
    department: "Central Library",
    date: "Oct 25, 2026",
    category: "announcement",
    priority: "medium",
    pinned: false,
    views: 421,
    icon: BookOpen,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    tags: ["All Students"],
  },
  {
    id: "5",
    title: "Convocation Ceremony 2026 — Graduation Dress Code & Instructions",
    content: "Final year students are requested to collect their graduation gowns from the administrative block between 10 AM-4 PM this week. Ceremony starts at 10 AM sharp. Entry closes at 9:45 AM. Parents and guests must present invitation cards.",
    department: "Academic Affairs",
    date: "Oct 24, 2026",
    category: "announcement",
    priority: "urgent",
    pinned: false,
    views: 780,
    icon: Award,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    tags: ["Final Year", "Urgent"],
  },
  {
    id: "6",
    title: "National Scholarship Portal — Application Window Open Until Nov 15",
    content: "Students eligible for NSP scholarships must apply before November 15th. Required documents: Aadhaar, income certificate, last year marksheet, bank passbook. Visit the accounts section for assistance.",
    department: "Student Affairs",
    date: "Oct 23, 2026",
    category: "announcement",
    priority: "medium",
    pinned: false,
    views: 655,
    icon: Info,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    tags: ["Financial Aid"],
  },
];

const CATEGORIES = ["All", "Examination", "Event", "Workshop", "Announcement"];
const PRIORITIES = ["All Priorities", "Urgent", "High", "Medium", "Low"];

const PRIORITY_CONFIG: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  urgent: { label: "Urgent", class: "bg-rose-100 text-rose-700 border-rose-200", icon: AlertTriangle },
  high: { label: "High", class: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertTriangle },
  medium: { label: "Medium", class: "bg-blue-100 text-blue-700 border-blue-200", icon: Info },
  low: { label: "Low", class: "bg-slate-100 text-slate-600 border-slate-200", icon: CheckCircle },
};

const CATEGORY_COLORS: Record<string, string> = {
  examination: "bg-rose-50 text-rose-700 border-rose-200",
  event: "bg-blue-50 text-blue-700 border-blue-200",
  workshop: "bg-violet-50 text-violet-700 border-violet-200",
  announcement: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const filtered = NOTICES.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All" || n.category === selectedCategory.toLowerCase();
    const matchPri = selectedPriority === "All Priorities" || n.priority === selectedPriority.toLowerCase();
    return matchSearch && matchCat && matchPri;
  });

  const pinned = filtered.filter((n) => n.pinned);
  const rest = filtered.filter((n) => !n.pinned);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">All Notices</h1>
            <p className="text-xs text-slate-500">{NOTICES.length} notices published</p>
          </div>
        </div>
        <Link
          href="/notices/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
        >
          <Plus className="h-4 w-4" />
          Publish Notice
        </Link>
      </div>

      <div className="p-6 max-w-5xl space-y-5">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notices by title, department, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 pt-1">Category:</span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${selectedCategory === cat ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 pt-1">Priority:</span>
                {PRIORITIES.map((pri) => (
                  <button
                    key={pri}
                    onClick={() => setSelectedPriority(pri)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${selectedPriority === pri ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pinned Section */}
        {pinned.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Pin className="h-3.5 w-3.5" />
              Pinned Notices
            </div>
            {pinned.map((notice) => {
              const Icon = notice.icon;
              const PrioIcon = PRIORITY_CONFIG[notice.priority].icon;
              return (
                <div key={notice.id} className="group bg-gradient-to-r from-blue-50/80 to-violet-50/40 rounded-2xl border border-blue-200/60 shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl ${notice.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-6 w-6 ${notice.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                          <Pin className="h-2.5 w-2.5" /> Pinned
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[notice.category]}`}>
                          {notice.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${PRIORITY_CONFIG[notice.priority].class}`}>
                          <PrioIcon className="h-2.5 w-2.5" />
                          {PRIORITY_CONFIG[notice.priority].label}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1.5">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">{notice.content}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{notice.department}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{notice.date}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{notice.views} views</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => toggleBookmark(notice.id)}
                        className={`p-1.5 rounded-lg transition-colors ${bookmarked.has(notice.id) ? "text-blue-600 bg-blue-100" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* All Notices */}
        <div className="space-y-3">
          {rest.length > 0 && pinned.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Bell className="h-3.5 w-3.5" />
              All Notices ({rest.length})
            </div>
          )}
          {rest.length === 0 && filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No notices match your search.</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedPriority("All Priorities"); }} className="mt-3 text-blue-600 text-sm font-semibold hover:underline">
                Clear filters
              </button>
            </div>
          )}
          {rest.map((notice) => {
            const Icon = notice.icon;
            const PrioIcon = PRIORITY_CONFIG[notice.priority].icon;
            return (
              <div key={notice.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className={`h-11 w-11 rounded-xl ${notice.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${notice.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[notice.category]}`}>
                        {notice.category}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${PRIORITY_CONFIG[notice.priority].class}`}>
                        <PrioIcon className="h-2.5 w-2.5" />
                        {PRIORITY_CONFIG[notice.priority].label}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-2.5">{notice.content}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{notice.department}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{notice.date}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{notice.views} views</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => toggleBookmark(notice.id)}
                      className={`p-1.5 rounded-lg transition-colors ${bookmarked.has(notice.id) ? "text-blue-600 bg-blue-100" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
