"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Eye,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  BookOpen,
  Trophy,
  GraduationCap,
  Sparkles,
  Zap,
} from "lucide-react";
import { Notice } from "@/types";
import {
  getNotices,
  deleteNotice,
  updateNotice,
  isSupabaseConfigured,
} from "@/lib/services/notices";
import { NOTICE_CATEGORIES, NoticeCategory } from "@/lib/schemas/notice";
import {
  formatFriendlyDate,
  isTodayInIST,
  isTomorrowInIST,
  isThisWeekInIST,
  isThisMonthInIST,
  computeEventStatus,
  computeRegistrationStatus,
} from "@/lib/utils/dates";
import { useToast } from "@/context/toast-context";

export default function NoticesPage() {
  const { success, error: toastError } = useToast();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"upcoming" | "newest" | "oldest" | "deadline">("upcoming");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Modals state
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const isSupa = isSupabaseConfigured();

  // Load notices from service
  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await getNotices();
      setNotices(data);
    } catch {
      toastError("Load Error", "Failed to retrieve notices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    getNotices()
      .then((data) => {
        if (mounted) {
          setNotices(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          toastError("Load Error", "Failed to retrieve notices.");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [toastError]);

  // Filter & Sort Logic
  const filteredNotices = useMemo(() => {
    let result = [...notices];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          (n.venue && n.venue.toLowerCase().includes(q)) ||
          n.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((n) => n.category === selectedCategory);
    }

    // Date filters
    if (selectedDateFilter === "today") {
      result = result.filter((n) => isTodayInIST(n.event_date));
    } else if (selectedDateFilter === "tomorrow") {
      result = result.filter((n) => isTomorrowInIST(n.event_date));
    } else if (selectedDateFilter === "this-week") {
      result = result.filter((n) => isThisWeekInIST(n.event_date));
    } else if (selectedDateFilter === "this-month") {
      result = result.filter((n) => isThisMonthInIST(n.event_date));
    } else if (selectedDateFilter === "custom" && customStartDate) {
      result = result.filter((n) => {
        if (!n.event_date) return false;
        if (customEndDate) {
          return n.event_date >= customStartDate && n.event_date <= customEndDate;
        }
        return n.event_date >= customStartDate;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "deadline") {
        if (!a.registration_deadline) return 1;
        if (!b.registration_deadline) return -1;
        return a.registration_deadline.localeCompare(b.registration_deadline);
      }
      // "upcoming" first
      if (!a.event_date) return 1;
      if (!b.event_date) return -1;
      return a.event_date.localeCompare(b.event_date);
    });

    return result;
  }, [notices, search, selectedCategory, selectedDateFilter, customStartDate, customEndDate, sortBy]);

  // Handle Delete
  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteNotice(deletingId);
      setNotices((prev) => prev.filter((n) => n.id !== deletingId));
      success("Notice Deleted", "The announcement has been permanently removed.");
      setDeletingId(null);
    } catch (err: any) {
      toastError("Delete Failed", err.message);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    try {
      setUpdating(true);
      const updated = await updateNotice(editingNotice.id, {
        title: editingNotice.title,
        description: editingNotice.description,
        venue: editingNotice.venue,
        category: editingNotice.category,
        event_date: editingNotice.event_date,
        event_time: editingNotice.event_time,
        registration_deadline: editingNotice.registration_deadline,
      });

      if (updated) {
        setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        success("Updated Successfully", `Changes to "${updated.title}" saved.`);
        setEditingNotice(null);
      }
    } catch (err: any) {
      toastError("Update Failed", err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Campus Notices & Bulletins</h1>
            <p className="text-xs text-slate-500">
              {filteredNotices.length} {filteredNotices.length === 1 ? "notice" : "notices"} matching filters
              {isSupa ? " • Cloud Synced" : " • Local Database Mode"}
            </p>
          </div>
        </div>

        <Link
          href="/notices/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Notice</span>
        </Link>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Search, Filter & Sort Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, venue or keyword..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="upcoming">Upcoming Event First</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="deadline">Deadline First</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Toggle Filters Button */}
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                showFiltersPanel || selectedCategory !== "All" || selectedDateFilter !== "all"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {(selectedCategory !== "All" || selectedDateFilter !== "all") && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </button>
          </div>

          {/* Filter Panel (Collapsible) */}
          {showFiltersPanel && (
            <div className="pt-4 border-t border-slate-100 space-y-4 animate-slide-in">
              {/* Category Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      selectedCategory === "All"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    All Categories
                  </button>
                  {NOTICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filters */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Date Range:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", label: "Anytime" },
                    { id: "today", label: "Today" },
                    { id: "tomorrow", label: "Tomorrow" },
                    { id: "this-week", label: "This Week" },
                    { id: "this-month", label: "This Month" },
                    { id: "custom", label: "Custom Range" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedDateFilter(filter.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        selectedDateFilter === filter.id
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}

                  {selectedDateFilter === "custom" && (
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                        placeholder="Start"
                      />
                      <span className="text-xs text-slate-400">to</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                        placeholder="End"
                      />
                    </div>
                  )}

                  {(selectedCategory !== "All" || selectedDateFilter !== "all" || search) && (
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSelectedDateFilter("all");
                        setSearch("");
                        setCustomStartDate("");
                        setCustomEndDate("");
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline ml-auto"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notices Cards Grid / List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-3"
              >
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No notices found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {search || selectedCategory !== "All" || selectedDateFilter !== "all"
                ? "Try adjusting your search keywords or clearing your filters."
                : "No notices have been published yet. Be the first to post an announcement!"}
            </p>
            <div className="pt-2">
              <Link
                href="/notices/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                Publish New Notice
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotices.map((notice) => {
              const eventStatus = computeEventStatus(notice.event_date, notice.event_time);
              const regStatus = computeRegistrationStatus(notice.registration_deadline);
              const isToday = isTodayInIST(notice.event_date);

              return (
                <div
                  key={notice.id}
                  className={`group bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${
                    isToday
                      ? "border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20"
                      : notice.priority === "urgent"
                      ? "border-rose-200 hover:border-rose-300"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Badge Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isToday && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                            HAPPENING TODAY
                          </span>
                        )}

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {notice.category}
                        </span>

                        {notice.priority === "urgent" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Urgent
                          </span>
                        )}

                        {notice.priority === "expired" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Past Event
                          </span>
                        )}

                        {regStatus === "urgent" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                            Registration Closing Soon!
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => setViewingNotice(notice)}
                        className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {notice.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {notice.description}
                      </p>

                      {/* Metadata row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1">
                        {notice.event_date && (
                          <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <Calendar className="h-3.5 w-3.5 text-blue-600" />
                            {formatFriendlyDate(notice.event_date)}
                            {notice.event_time && ` at ${notice.event_time}`}
                          </span>
                        )}

                        {notice.venue && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {notice.venue}
                          </span>
                        )}

                        {notice.registration_deadline && (
                          <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                            <CalendarCheck className="h-3.5 w-3.5" />
                            Register by {formatFriendlyDate(notice.registration_deadline)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col items-center gap-1 shrink-0 self-end sm:self-start pt-2 sm:pt-0">
                      <button
                        onClick={() => setViewingNotice(notice)}
                        title="View Notice Details"
                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setEditingNotice(notice)}
                        title="Edit Notice"
                        className="p-2 rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setDeletingId(notice.id)}
                        title="Delete Notice"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= VIEW DETAIL MODAL ================= */}
      {viewingNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setViewingNotice(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {viewingNotice.category}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    viewingNotice.priority === "urgent"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {viewingNotice.priority.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setViewingNotice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {viewingNotice.title}
              </h2>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed whitespace-pre-wrap">
                {viewingNotice.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">EVENT DATE</span>
                <span className="font-semibold text-slate-800">
                  {formatFriendlyDate(viewingNotice.event_date)}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">TIME</span>
                <span className="font-semibold text-slate-800">
                  {viewingNotice.event_time || "Not specified"}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">LOCATION / VENUE</span>
                <span className="font-semibold text-slate-800">
                  {viewingNotice.venue || "Not specified"}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">REGISTRATION CUTOFF</span>
                <span className="font-semibold text-slate-800">
                  {formatFriendlyDate(viewingNotice.registration_deadline)}
                </span>
              </div>
            </div>

            {viewingNotice.source_text && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  ORIGINAL SOURCE TEXT
                </span>
                <p className="text-xs text-slate-500 italic bg-slate-100/60 p-3 rounded-xl border border-slate-200">
                  &ldquo;{viewingNotice.source_text}&rdquo;
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingNotice(viewingNotice);
                  setViewingNotice(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200"
              >
                Edit Notice
              </button>
              <button
                onClick={() => setViewingNotice(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setEditingNotice(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Notice</h3>
              <button
                onClick={() => setEditingNotice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingNotice.description}
                  onChange={(e) =>
                    setEditingNotice({ ...editingNotice, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingNotice.category}
                    onChange={(e) =>
                      setEditingNotice({
                        ...editingNotice,
                        category: e.target.value as NoticeCategory,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {NOTICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={editingNotice.venue || ""}
                    onChange={(e) =>
                      setEditingNotice({ ...editingNotice, venue: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={editingNotice.event_date || ""}
                    onChange={(e) =>
                      setEditingNotice({ ...editingNotice, event_date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Time</label>
                  <input
                    type="text"
                    value={editingNotice.event_time || ""}
                    onChange={(e) =>
                      setEditingNotice({ ...editingNotice, event_time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={editingNotice.registration_deadline || ""}
                    onChange={(e) =>
                      setEditingNotice({
                        ...editingNotice,
                        registration_deadline: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete this notice?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action cannot be undone. The notice will be removed from your dashboard and calendar.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
