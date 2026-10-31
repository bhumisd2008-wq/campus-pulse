"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Edit3,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Save,
  Copy,
  Info,
  CalendarCheck,
  Check,
} from "lucide-react";
import { createNotice, isSupabaseConfigured } from "@/lib/services/notices";
import { NOTICE_CATEGORIES, NoticeCategory, NoticePriority } from "@/lib/schemas/notice";
import { useToast } from "@/context/toast-context";
import { useAuth } from "@/context/auth-context";

const SAMPLE_NOTICE_TEXT =
  "Attention students! An AI workshop is organized on 15 November 2026 at 11 AM in Seminar Hall 2. Registration closes on 12 November. All interested students can participate.";

export default function AddNoticePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<"ai" | "manual">("ai");

  // AI Paste State
  const [pastedText, setPastedText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [aiError, setAiError] = useState("");

  // Extracted / Form Data State
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    venue: "",
    category: "Workshops" as NoticeCategory,
    registration_deadline: "",
    priority: "upcoming" as NoticePriority,
    source_text: "",
  });

  const [isExtracted, setIsExtracted] = useState(false);
  const [saving, setSaving] = useState(false);
  const isSupa = isSupabaseConfigured();

  // Load sample text helper
  const handleLoadSample = () => {
    setPastedText(SAMPLE_NOTICE_TEXT);
    setAiError("");
  };

  // AI Extraction Trigger
  const handleExtract = async () => {
    if (!pastedText.trim()) {
      setAiError("Please paste notice text to extract.");
      return;
    }

    setExtracting(true);
    setAiError("");

    try {
      const res = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pastedText }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isConfigError) {
          setAiError(
            "Gemini API key is not yet set in .env.local (GEMINI_API_KEY). You can configure it or fill details manually below."
          );
        } else {
          setAiError(data.error || "Failed to extract information.");
        }
        setExtracting(false);
        return;
      }

      if (data.success && data.data) {
        const d = data.data;
        setForm({
          title: d.title || "",
          description: d.description || "",
          event_date: d.eventDate || "",
          event_time: d.eventTime || "",
          venue: d.venue || "",
          category: (d.category as NoticeCategory) || "Workshops",
          registration_deadline: d.registrationDeadline || "",
          priority: (d.priority as NoticePriority) || "upcoming",
          source_text: pastedText,
        });

        setIsExtracted(true);
        success("Extraction Complete!", "Review and edit the extracted fields below.");
      }
    } catch (err: any) {
      setAiError(err.message || "Failed to communicate with extraction endpoint.");
      toastError("Extraction Error", "Could not connect to Gemini extraction route.");
    } finally {
      setExtracting(false);
    }
  };

  // Confirm and Save into Database
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toastError("Validation Error", "Title is required.");
      return;
    }
    if (!form.description.trim()) {
      toastError("Validation Error", "Description is required.");
      return;
    }

    setSaving(true);

    try {
      await createNotice({
        user_id: user?.id || null,
        title: form.title.trim(),
        description: form.description.trim(),
        event_date: form.event_date || null,
        event_time: form.event_time || null,
        venue: form.venue || null,
        category: form.category,
        registration_deadline: form.registration_deadline || null,
        priority: form.priority,
        source_text: form.source_text || pastedText || null,
      });

      success("Notice Saved!", `"${form.title}" is now published.`);
      router.push("/notices");
    } catch (err: any) {
      toastError("Save Failed", err.message || "Could not save notice.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/notices"
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Add New Campus Notice</h1>
            <p className="text-xs text-slate-500">
              {isSupa ? "Saves to Supabase Database" : "Saves to Local Storage Mode"}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "ai"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            AI Paste & Extract
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "manual"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5 text-blue-600" />
            Manual Entry
          </button>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* ================= AI EXTRACTION TAB ================= */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            {/* Input Box Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Paste Unstructured Campus Notice
                    </h2>
                    <p className="text-xs text-slate-500">
                      Supports WhatsApp forwards, email circulars, PDF snippets, and bulletins
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Load Example Notice
                </button>
              </div>

              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  if (aiError) setAiError("");
                }}
                placeholder="Paste notice here, e.g.:&#10;'Attention students! An AI workshop is organized on 15 November 2026 at 11 AM in Seminar Hall 2. Registration closes on 12 November. All interested students can participate.'"
                className="w-full p-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none font-sans leading-relaxed"
              />

              {aiError && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{aiError}</p>
                    <p className="text-amber-700/80 mt-1">
                      You can still manually enter the details in the form below.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">
                  {pastedText.length} characters • Powered by Gemini 2.5 Flash
                </span>

                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={extracting || !pastedText.trim()}
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {extracting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Extracting Information...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Extract Information
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Extracted Preview & Form */}
            {(isExtracted || form.title) && (
              <div className="bg-white rounded-2xl border border-violet-200 shadow-md p-6 space-y-6 animate-slide-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      Editable Extracted Details
                    </h3>
                  </div>
                  <span className="text-xs text-violet-700 font-semibold bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full">
                    Verify or edit before confirming
                  </span>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="Title of event or notice"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                      placeholder="Detailed announcement content"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value as NoticeCategory })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {NOTICE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Priority Status
                      </label>
                      <select
                        value={form.priority}
                        onChange={(e) =>
                          setForm({ ...form, priority: e.target.value as NoticePriority })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="urgent">Urgent (&lt; 24h)</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={form.event_date || ""}
                        onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        Event Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 11:00 AM"
                        value={form.event_time || ""}
                        onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <CalendarCheck className="h-3.5 w-3.5 text-rose-600" />
                        Registration Deadline
                      </label>
                      <input
                        type="date"
                        value={form.registration_deadline || ""}
                        onChange={(e) =>
                          setForm({ ...form, registration_deadline: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      Venue / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Seminar Hall 2, Online Google Meet, etc."
                      value={form.venue || ""}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsExtracted(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Confirm and Save Notice
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================= MANUAL ENTRY TAB ================= */}
        {activeTab === "manual" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Manual Notice Entry</h2>
              <p className="text-xs text-slate-500">
                Directly fill in notice details for instant publishing
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term Examination Datesheet"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed announcement content and instructions for students"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as NoticeCategory })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                    placeholder="e.g. Hall 3, Online, Lab 4"
                    value={form.venue || ""}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={form.event_date || ""}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={form.event_time || ""}
                    onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={form.registration_deadline || ""}
                    onChange={(e) =>
                      setForm({ ...form, registration_deadline: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href="/notices"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Notice...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Publish Notice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
