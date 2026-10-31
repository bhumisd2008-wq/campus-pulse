"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  User,
  Bell,
  Key,
  Database,
  Palette,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Zap,
  HardDrive,
  Mail,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { isSupabaseConfigured } from "@/lib/services/notices";
import { useToast } from "@/context/toast-context";

export default function SettingsPage() {
  const { user } = useAuth();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "supabase" | "gemini" | "notifications">("profile");

  // Profile Form
  const [fullName, setFullName] = useState(user?.fullName || "Alex Johnson");
  const [email, setEmail] = useState(user?.email || "alex.johnson@university.edu");
  const [department, setDepartment] = useState(user?.department || "Computer Science & IT");
  const [semester, setSemester] = useState(user?.semester?.toString() || "6");
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || "CS2021045");

  // Gemini Test state
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);

  const [copiedKey, setCopiedKey] = useState(false);

  const isSupa = isSupabaseConfigured();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const updated = {
        id: user?.id || "student-alex-001",
        fullName,
        email,
        department,
        semester,
        rollNumber,
        role: "student" as const,
      };
      localStorage.setItem("campus_pulse_local_user", JSON.stringify(updated));
    }
    success("Profile Saved", "Your academic profile information has been updated.");
  };

  const handleTestGemini = async () => {
    setTestingGemini(true);
    setGeminiResult(null);

    try {
      const res = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "College notice: Machine learning seminar on Nov 15 2026 at 10 AM in Hall 1.",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeminiResult("SUCCESS: Gemini API is configured and operational!");
        success("Gemini API Online", "Test notice extracted successfully.");
      } else {
        setGeminiResult(data.error || "Gemini API key is missing or invalid.");
      }
    } catch (e: any) {
      setGeminiResult("Failed to reach server API route.");
    } finally {
      setTestingGemini(false);
    }
  };

  const handleCopyEnvTemplate = () => {
    const text = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here`;

    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    success("Copied to Clipboard", "Paste into your .env.local file.");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Application Settings</h1>
            <p className="text-xs text-slate-500">
              Manage database connection, Gemini AI keys, and user profile
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: "profile", label: "Student Profile", icon: User },
            { id: "supabase", label: "Supabase Database", icon: Database },
            { id: "gemini", label: "Gemini AI Setup", icon: Zap },
            { id: "notifications", label: "Alerts & Notifications", icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                {fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
                <p className="text-xs text-slate-500">{email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  Undergraduate Student
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="Computer Science & IT">Computer Science & IT</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Management Studies">Management Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s.toString()}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll / ID Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Supabase */}
        {activeTab === "supabase" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Supabase Cloud Database Status</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect PostgreSQL with Row Level Security (RLS) for cloud synchronization
                </p>
              </div>

              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isSupa
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {isSupa ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <HardDrive className="h-3.5 w-3.5 text-blue-600" />}
                {isSupa ? "Supabase Active" : "Local Storage Mode"}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3">
              <p className="font-semibold text-slate-800">
                How Supabase integration works in Campus Pulse:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>When Supabase credentials are in <code className="bg-white px-1.5 py-0.5 rounded border">.env.local</code>, all notices are saved into the cloud PostgreSQL table <code className="bg-white px-1.5 py-0.5 rounded border">public.notices</code>.</li>
                <li>When Supabase is not yet configured, Campus Pulse activates its <strong>Local Development Storage Fallback</strong>, keeping 100% of the UI, CRUD features, calendar, and reminders functional using your browser&apos;s persistent local storage.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                SQL Migration Script Included
              </h4>
              <p className="text-xs text-slate-500">
                The database schema script is ready in: <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">supabase/schema.sql</code>. Run this in your Supabase SQL Editor.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCopyEnvTemplate}
                className="flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy .env.local Template
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Gemini AI */}
        {activeTab === "gemini" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Google Gemini AI Engine</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Powers unstructured notice extraction and weekly executive summaries
                </p>
              </div>

              <span className="bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-violet-600" />
                Gemini 2.5 Flash
              </span>
            </div>

            <div className="bg-violet-50/60 rounded-2xl p-5 border border-violet-100 text-xs space-y-2">
              <p className="font-bold text-violet-900">Where to set your Gemini API key:</p>
              <p className="text-violet-800 leading-relaxed">
                Add your Gemini API key in <code className="bg-white px-1.5 py-0.5 rounded border border-violet-200 font-mono">.env.local</code> as <code className="bg-white px-1.5 py-0.5 rounded border border-violet-200 font-mono font-bold">GEMINI_API_KEY</code>. You can get a free key from <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google AI Studio</a>.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Test Connection to Gemini Engine
              </h4>
              <p className="text-xs text-slate-500">
                Click below to send a sample college notice to your server route <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">/api/ai/extract</code> to verify response handling:
              </p>

              <button
                onClick={handleTestGemini}
                disabled={testingGemini}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                {testingGemini ? "Testing Gemini Extraction..." : "Test Gemini API Connection"}
              </button>

              {geminiResult && (
                <div
                  className={`p-4 rounded-xl text-xs font-medium border ${
                    geminiResult.startsWith("SUCCESS")
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  {geminiResult}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-900">Notification Settings</h3>

            <div className="space-y-4 text-xs">
              {[
                { title: "24-Hour Urgent Alerts", desc: "Show urgent badges when a deadline is within 24 hours" },
                { title: "Browser Desktop Notifications", desc: "Allow system desktop alerts for impending submission cutoffs" },
                { title: "AI Weekly Digest Alerts", desc: "Notify when a fresh weekly AI summary is generated" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
