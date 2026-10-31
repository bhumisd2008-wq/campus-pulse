"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Calendar,
  AlertTriangle,
  BookOpen,
  Trophy,
  GraduationCap,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Info,
  Key,
  CalendarCheck,
  MapPin,
  ListChecks,
} from "lucide-react";
import { Notice, WeeklySummaryResult } from "@/types";
import { getNotices } from "@/lib/services/notices";
import { formatFriendlyDate, getNowInIST } from "@/lib/utils/dates";
import { useToast } from "@/context/toast-context";

const SAVED_SUMMARY_KEY = "campus_pulse_latest_ai_summary_v1";

export default function SummaryPage() {
  const { success, error: toastError } = useToast();

    const [notices, setNotices] = useState<Notice[]>([]);
    const [loadingNotices, setLoadingNotices] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [summary, setSummary] = useState<WeeklySummaryResult | null>(null);
    const [apiError, setApiError] = useState("");

      useEffect(() => {
        async function init() {
          try {
            setLoadingNotices(true);
            const data = await getNotices();
            setNotices(data);

            // Load cached summary if available
            const cached = localStorage.getItem(SAVED_SUMMARY_KEY);
            if (cached) {
              try {
                setSummary(JSON.parse(cached));
              } catch {
                // ignore
              }
            }
          } catch (err) {
            console.error("Failed to load notices:", err);
          } finally {
            setLoadingNotices(false);
          }
        }
        init();
      }, []);

      const handleGenerateSummary = async () => {
        setGenerating(true);
          setApiError("");

          try {
            const res = await fetch("/api/ai/summary", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notices }),
            });

            const data = await res.json();

            if (!res.ok) {
              if (data.isConfigError) {
                setApiError(
                  "GEMINI_API_KEY is not set in .env.local. Add your Gemini API key to enable live generation."
                );
              } else {
                setApiError(data.error || "Failed to generate AI weekly summary.");
              }
              return;
            }

            if (data.success && data.data) {
              const istDate = getNowInIST().toLocaleDateString("en-IN", {
                timeZone: "Asia/Kolkata",
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const fullResult: WeeklySummaryResult = {
                weekRange: `Current Week (${istDate})`,
                generatedAt: new Date().toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                headline: data.data.headline || "Weekly Campus Intelligence",
                overview: data.data.overview || "Overview of your upcoming campus activities.",
                importantEvents: data.data.importantEvents || [],
                examinations: data.data.examinations || [],
                deadlines: data.data.deadlines || [],
                workshopsAndCompetitions: data.data.workshopsAndCompetitions || [],
                actionItems: data.data.actionItems || [],
              };

              setSummary(fullResult);
              localStorage.setItem(SAVED_SUMMARY_KEY, JSON.stringify(fullResult));
              success("Briefing Generated!", "Your personalized weekly summary is ready.");
            }
          } catch (err: any) {
            setApiError(err.message || "Failed to connect to summary API.");
            toastError("Generation Error", "Could not complete AI summarization.");
          } finally {
            setGenerating(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-50">
          {/* Top Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">AI Weekly Campus Briefing</h1>
                  <p className="text-xs text-slate-500">
                    Personalized synthesis powered by Google Gemini 2.5 Flash
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={generating || loadingNotices}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-violet-500/25 hover:scale-[1.02] transition-all disabled:opacity-60 cursor-pointer self-end sm:self-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Synthesizing Notices...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    {summary ? "Regenerate Summary" : "Generate This Week's Summary"}
                  </>
                )}
              </button>
            </div>

                    <div className="p-6 max-w-5xl mx-auto space-y-6">
                      {/* Banner Card */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2d1b69] to-[#0f172a] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-violet-900/40">
                        <div className="absolute top-0 right-0 h-full w-80 bg-gradient-to-l from-violet-500/20 to-transparent pointer-events-none" />

                        <div className="relative space-y-3">
                          <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-semibold px-3 py-1 rounded-full">
                            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                            What do I need to know this week?
                          </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                              Instant Academic Executive Briefing
                            </h2>

                            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                              Campus Pulse queries your live database notices, extracts impending exam dates, assignment cutoffs, and workshop schedules, and distills them into a single actionable briefing.
                            </p>

                              <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                  onClick={handleGenerateSummary}
                                  disabled={generating}
                                  className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer"
                                >
                                  {generating ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Analyzing {notices.length} Notices...
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="h-4 w-4" />
                                      Generate Briefing Now
                                    </>
                                  )}
                                </button>

                                <span className="text-xs text-slate-400">
                                  Connected to {notices.length} saved campus announcements
                                </span>
                              </div>
                            </div>
                        </div>

                                  {/* API Error Notification */}
                                  {apiError && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                                      <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-amber-900">Gemini API Setup Required</h4>
                                        <p className="text-xs text-amber-800 leading-relaxed">{apiError}</p>
                                        <div className="pt-2">
                                          <Link
                                            href="/settings"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-100 px-3 py-1.5 rounded-lg hover:bg-violet-200"
                                          >
                                            <Key className="h-3.5 w-3.5" /> Configure API Key in Settings
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Generated Summary View */}
                                  {summary ? (
                                    <div className="space-y-6 animate-slide-in">
                                      {/* Header & Overview Card */}
                                      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                                          <div>
                                            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
                                              {summary.weekRange}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 mt-2">{summary.headline}</h3>
                                          </div>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                              <Clock className="h-3.5 w-3.5" /> Generated at {summary.generatedAt}
                                            </span>
                                        </div>

                                                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                    {summary.overview}
                                                  </p>

                                                  {/* Action Items Box */}
                                                  {summary.actionItems && summary.actionItems.length > 0 && (
                                                    <div className="bg-gradient-to-br from-blue-50/60 to-violet-50/60 rounded-2xl p-5 border border-blue-100 space-y-3">
                                                      <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wide">
                                                        <ListChecks className="h-4 w-4 text-blue-600" />
                                                        Key Action Items For This Week
                                                      </div>
                                                        <ul className="space-y-2">
                                                          {summary.actionItems.map((item, i) => (
                                                            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-800">
                                                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                                              <span className="leading-relaxed font-medium">{item}</span>
                                                            </li>
                                                          ))}
                                                        </ul>
                                                      </div>
              )}
                                                    </div>

            {/* Structured Category Columns Grid */}
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Examinations */}
                                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                                                      <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                                                        <GraduationCap className="h-4 w-4" />
                                                        Upcoming Examinations
                                                      </div>
                                                      {summary.examinations && summary.examinations.length > 0 ? (
                                                        <div className="space-y-2.5">
                                                          {summary.examinations.map((exam, i) => (
                                                            <div key={i} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                                                              <div className="flex items-center justify-between font-bold text-slate-900">
                                                                <span>{exam.title}</span>
                                                                <span className="text-rose-600">{exam.date}</span>
                                                              </div>
                                                              {exam.details && <p className="text-slate-500 mt-1">{exam.details}</p>}
                                                            </div>
                                                          ))}
                                                        </div>
                                                    ) : (
                                                    <p className="text-xs text-slate-400 py-3">No examinations scheduled this week.</p>
                )}
                                                  </div>

                                                            {/* Deadlines */}
                                                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                                                              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                                                                <CalendarCheck className="h-4 w-4" />
                                                                Critical Deadlines & Cutoffs
                                                              </div>
                                                              {summary.deadlines && summary.deadlines.length > 0 ? (
                                                                <div className="space-y-2.5">
                                                                  {summary.deadlines.map((item, i) => (
                                                                    <div
                                                                      key={i}
                                                                      className={`p-3 rounded-xl border text-xs ${item.urgent
                                                                          ? "bg-amber-50/80 border-amber-200"
                                                                          : "bg-slate-50 border-slate-200"
                                                                        }`}
                                                                    >
                                                                      <div className="flex items-center justify-between font-bold text-slate-900">
                                                                        <span>{item.title}</span>
                                                                        <span className={item.urgent ? "text-rose-600 font-black" : "text-slate-600"}>
                                                                          {item.deadline}
                                                                        </span>
                                                                      </div>
                                                                    </div>
                    ))}
                                                                    </div>
                                                                    ) : (
                                                                    <p className="text-xs text-slate-400 py-3">No urgent assignment or fee deadlines.</p>
                )}
                                                                  </div>

                                                                  {/* Workshops & Competitions */}
                                                                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                                                                    <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
                                                                      <Trophy className="h-4 w-4" />
                                                                      Workshops & Competitions
                                                                    </div>
                                                                    {summary.workshopsAndCompetitions && summary.workshopsAndCompetitions.length > 0 ? (
                                                                      <div className="space-y-2.5">
                                                                        {summary.workshopsAndCompetitions.map((w, i) => (
                                                                          <div key={i} className="p-3 rounded-xl bg-violet-50/60 border border-violet-100 text-xs">
                                                                            <div className="flex items-center justify-between font-bold text-slate-900">
                                                                              <span>{w.title}</span>
                                                                              <span className="text-violet-700">{w.date}</span>
                                                                            </div>
                                                                            {w.venue && (
                                                                              <p className="text-slate-500 mt-1 flex items-center gap-1">
                                                                                <MapPin className="h-3 w-3" /> {w.venue}
                                                                              </p>
                                                                            )}
                                                                          </div>
                                                                    ))}
                                                                  </div>
                                                                  ) : (
                                                                  <p className="text-xs text-slate-400 py-3">No workshops scheduled this week.</p>
                )}
                                                                </div>

                                                              {/* General Important Events */}
                                                              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                                                                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                                                                  <Calendar className="h-4 w-4" />
                                                                  General Campus Activities
                                                                </div>
                                                                {summary.importantEvents && summary.importantEvents.length > 0 ? (
                                                                  <div className="space-y-2.5">
                                                                    {summary.importantEvents.map((evt, i) => (
                                                                      <div key={i} className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                                                                        <div className="flex items-center justify-between font-bold text-slate-900">
                                                                          <span>{evt.title}</span>
                                                                          <span className="text-blue-700">{evt.date}</span>
                                                                        </div>
                                                                        <div className="text-slate-500 mt-1 flex items-center gap-3">
                                                                          {evt.time && <span>Time: {evt.time}</span>}
                                                                          {evt.venue && <span>Venue: {evt.venue}</span>}
                                                                        </div>
                                                                      </div>
                                                                    ))}
                                                                  </div>
                                                                ) : (
                                                                  <p className="text-xs text-slate-400 py-3">No other events scheduled.</p>
                                                                )}
                                                              </div>
                                                            </div>
                                                          </div>
                                                      ) : (
                                                      !generating && (
                                                      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                                                        <div className="h-14 w-14 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
                                                          <Sparkles className="h-7 w-7" />
                                                        </div>
                                                        <h3 className="text-base font-bold text-slate-900">No Weekly Briefing Generated Yet</h3>
                                                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                                                          Click &quot;Generate This Week&apos;s Summary&quot; to synthesize all campus circulars, workshops, and deadlines into an executive briefing.
                                                        </p>
                                                        <button
                                                          onClick={handleGenerateSummary}
                                                          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                                                        >
                                                          <Zap className="h-3.5 w-3.5" />
                                                          Generate Now
                                                        </button>
                                                      </div>
                                                      )
        )}
                                                    </div>
    </div>
                                                );
}
