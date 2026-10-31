"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Key,
  Database,
  Shield,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  Palette,
  Mail,
  Phone,
  BookOpen,
  Info,
  AlertTriangle,
  Activity,
} from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI Integration", icon: Activity },
  { id: "database", label: "Database", icon: Database },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showSupaKey, setShowSupaKey] = useState(false);
  const [showServiceKey, setShowServiceKey] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@university.edu",
    phone: "+91 98765 43210",
    department: "Computer Science & IT",
    semester: "6",
    rollNumber: "CS2021045",
  });

  const [notifications, setNotifications] = useState({
    newNotices: true,
    urgentAlerts: true,
    deadlineReminders: true,
    emailNotifications: false,
    weeklyDigest: true,
    eventReminders: true,
  });

  const [aiConfig, setAiConfig] = useState({
    geminiKey: "",
    model: "gemini-2.5-flash",
    autoGenerate: false,
    generateDay: "monday",
  });

  const [dbConfig, setDbConfig] = useState({
    supabaseUrl: "",
    supabaseAnonKey: "",
    serviceRoleKey: "",
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
    accentColor: "blue",
    compactMode: false,
    fontSize: "medium",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ACCENT_COLORS = [
    { id: "blue", class: "bg-blue-500" },
    { id: "violet", class: "bg-violet-500" },
    { id: "emerald", class: "bg-emerald-500" },
    { id: "rose", class: "bg-rose-500" },
    { id: "amber", class: "bg-amber-500" },
  ];

  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-start justify-between py-3.5 border-b border-slate-50 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
          checked ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    hint,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    hint?: string;
  }) => (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      />
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );

  const SecretField = ({
    label,
    value,
    onChange,
    placeholder,
    show,
    setShow,
    hint,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    show: boolean;
    setShow: (v: boolean) => void;
    hint?: string;
  }) => (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-mono"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <Settings className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Settings</h1>
            <p className="text-xs text-slate-500">Manage your account and application preferences</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="p-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="sm:w-52 shrink-0">
            <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-slate-50 last:border-0 ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 space-y-5">
            {/* ─── PROFILE ─── */}
            {activeTab === "profile" && (
              <>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  {/* Avatar Row */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{profile.fullName}</h3>
                      <p className="text-sm text-slate-500">{profile.email}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Student
                      </span>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField
                      label="Full Name"
                      value={profile.fullName}
                      onChange={(v) => setProfile((p) => ({ ...p, fullName: v }))}
                      placeholder="Your full name"
                    />
                    <InputField
                      label="Email Address"
                      value={profile.email}
                      onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                      placeholder="your@university.edu"
                      type="email"
                    />
                    <InputField
                      label="Phone Number"
                      value={profile.phone}
                      onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    <InputField
                      label="Roll Number"
                      value={profile.rollNumber}
                      onChange={(v) => setProfile((p) => ({ ...p, rollNumber: v }))}
                      placeholder="e.g. CS2021045"
                    />
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Department
                      </label>
                      <select
                        value={profile.department}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, department: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {[
                          "Computer Science & IT",
                          "Electronics & Communication",
                          "Mechanical Engineering",
                          "Civil Engineering",
                          "Information Technology",
                          "Business Administration",
                        ].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Current Semester
                      </label>
                      <select
                        value={profile.semester}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, semester: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {["1", "2", "3", "4", "5", "6", "7", "8"].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ─── NOTIFICATIONS ─── */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Notification Preferences</h3>
                <p className="text-xs text-slate-500 mb-5">
                  Control what alerts and updates you receive.
                </p>
                <div className="space-y-0">
                  <ToggleSwitch
                    checked={notifications.newNotices}
                    onChange={(v) => setNotifications((p) => ({ ...p, newNotices: v }))}
                    label="New Notice Alerts"
                    description="Notify when a new announcement is published on the portal."
                  />
                  <ToggleSwitch
                    checked={notifications.urgentAlerts}
                    onChange={(v) => setNotifications((p) => ({ ...p, urgentAlerts: v }))}
                    label="Urgent Alerts"
                    description="High-priority alerts for urgent campus communications."
                  />
                  <ToggleSwitch
                    checked={notifications.deadlineReminders}
                    onChange={(v) =>
                      setNotifications((p) => ({ ...p, deadlineReminders: v }))
                    }
                    label="Deadline Reminders"
                    description="Reminders 24 hours and 1 hour before due dates."
                  />
                  <ToggleSwitch
                    checked={notifications.emailNotifications}
                    onChange={(v) =>
                      setNotifications((p) => ({ ...p, emailNotifications: v }))
                    }
                    label="Email Notifications"
                    description="Send copies of alerts to your registered email address."
                  />
                  <ToggleSwitch
                    checked={notifications.weeklyDigest}
                    onChange={(v) => setNotifications((p) => ({ ...p, weeklyDigest: v }))}
                    label="Weekly AI Digest"
                    description="Receive the AI-generated campus summary every Monday morning."
                  />
                  <ToggleSwitch
                    checked={notifications.eventReminders}
                    onChange={(v) => setNotifications((p) => ({ ...p, eventReminders: v }))}
                    label="Event Reminders"
                    description="Notify 1 hour before events you've saved to your calendar."
                  />
                </div>
              </div>
            )}

            {/* ─── AI INTEGRATION ─── */}
            {activeTab === "ai" && (
              <>
                {/* Info Banner */}
                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 flex items-start gap-4">
                  <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                    <Info className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-violet-900 mb-1">
                      How AI Integration Works
                    </p>
                    <p className="text-xs text-violet-700 leading-relaxed">
                      Campus Pulse uses the Google Gemini API to generate weekly summaries, extract
                      deadlines from notices, and prioritize campus updates. Your API key is stored
                      only in your browser's local storage — it is never sent to our servers.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                  <h3 className="text-sm font-bold text-slate-900">Gemini API Configuration</h3>

                  <SecretField
                    label="Gemini API Key"
                    value={aiConfig.geminiKey}
                    onChange={(v) => setAiConfig((p) => ({ ...p, geminiKey: v }))}
                    placeholder="AIzaSy..."
                    show={showGeminiKey}
                    setShow={setShowGeminiKey}
                    hint="Get your free API key at aistudio.google.com. The key is stored locally and never shared."
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      AI Model
                    </label>
                    <select
                      value={aiConfig.model}
                      onChange={(e) => setAiConfig((p) => ({ ...p, model: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Higher quality)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Gemini 2.5 Flash offers the best balance of speed and quality for campus
                      summaries.
                    </p>
                  </div>

                  <div className="pt-2">
                    <ToggleSwitch
                      checked={aiConfig.autoGenerate}
                      onChange={(v) => setAiConfig((p) => ({ ...p, autoGenerate: v }))}
                      label="Auto-Generate Weekly Summary"
                      description="Automatically generate a summary every week on the selected day."
                    />
                    {aiConfig.autoGenerate && (
                      <div className="mt-3">
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">
                          Generate Every
                        </label>
                        <select
                          value={aiConfig.generateDay}
                          onChange={(e) =>
                            setAiConfig((p) => ({ ...p, generateDay: e.target.value }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          {[
                            "monday",
                            "tuesday",
                            "wednesday",
                            "thursday",
                            "friday",
                            "saturday",
                            "sunday",
                          ].map((d) => (
                            <option key={d} value={d} className="capitalize">
                              {d.charAt(0).toUpperCase() + d.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <span className="font-bold">Free Tier Limits:</span> The Gemini free tier
                      allows up to 15 requests/minute and 1,500 requests/day — more than enough for
                      weekly campus summaries.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ─── DATABASE ─── */}
            {activeTab === "database" && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
                  <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900 mb-1">Supabase Database</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Connect a Supabase project to persist notices, events, and user settings
                      across sessions. Without a connection, Campus Pulse uses local mock data.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                  <h3 className="text-sm font-bold text-slate-900">Supabase Configuration</h3>

                  <InputField
                    label="Project URL"
                    value={dbConfig.supabaseUrl}
                    onChange={(v) => setDbConfig((p) => ({ ...p, supabaseUrl: v }))}
                    placeholder="https://xxxxxxxxxxxx.supabase.co"
                    hint="Found in your Supabase project dashboard under Settings → API."
                  />

                  <SecretField
                    label="Anon / Public Key"
                    value={dbConfig.supabaseAnonKey}
                    onChange={(v) => setDbConfig((p) => ({ ...p, supabaseAnonKey: v }))}
                    placeholder="eyJhbGciOiJ..."
                    show={showSupaKey}
                    setShow={setShowSupaKey}
                    hint="Safe to use client-side. Row-level security policies control data access."
                  />

                  <SecretField
                    label="Service Role Key (Optional)"
                    value={dbConfig.serviceRoleKey}
                    onChange={(v) => setDbConfig((p) => ({ ...p, serviceRoleKey: v }))}
                    placeholder="eyJhbGciOiJ..."
                    show={showServiceKey}
                    setShow={setShowServiceKey}
                    hint="Only required for admin operations. Store this securely — never expose in client code."
                  />

                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-700 leading-relaxed">
                      <span className="font-bold">Security Notice:</span> Never commit API keys to
                      version control. Use environment variables (
                      <code className="font-mono bg-rose-100 px-1 rounded">.env.local</code>) for
                      production deployments.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ─── APPEARANCE ─── */}
            {activeTab === "appearance" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "light",
                        label: "Light",
                        preview: "bg-white border-slate-200",
                        text: "text-slate-900",
                      },
                      {
                        id: "dark",
                        label: "Dark",
                        preview: "bg-slate-900 border-slate-700",
                        text: "text-white",
                      },
                      {
                        id: "auto",
                        label: "System",
                        preview: "bg-gradient-to-br from-white to-slate-900 border-slate-300",
                        text: "text-slate-700",
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setAppearance((p) => ({ ...p, theme: t.id }))}
                        className={`relative rounded-xl border-2 p-3 transition-all ${
                          appearance.theme === t.id
                            ? "border-blue-500 shadow-md"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`${t.preview} border rounded-lg h-14 mb-2 flex items-center justify-center`}
                        >
                          <span className={`text-[9px] font-bold ${t.text}`}>Aa</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700">{t.label}</p>
                        {appearance.theme === t.id && (
                          <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-[8px] text-white font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Accent Color</h3>
                  <div className="flex items-center gap-3">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setAppearance((p) => ({ ...p, accentColor: c.id }))}
                        className={`h-9 w-9 rounded-full ${c.class} transition-all ${
                          appearance.accentColor === c.id
                            ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                            : "hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Font Size</h3>
                  <div className="flex gap-2">
                    {[
                      { id: "small", label: "Small" },
                      { id: "medium", label: "Medium" },
                      { id: "large", label: "Large" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setAppearance((p) => ({ ...p, fontSize: f.id }))}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                          appearance.fontSize === f.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <ToggleSwitch
                    checked={appearance.compactMode}
                    onChange={(v) => setAppearance((p) => ({ ...p, compactMode: v }))}
                    label="Compact Mode"
                    description="Reduce padding and spacing for a denser information layout."
                  />
                </div>
              </div>
            )}

            {/* ─── SECURITY ─── */}
            {activeTab === "security" && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Account Security</h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Minimum 8 characters"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all mt-2">
                    <Key className="h-4 w-4" />
                    Update Password
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Active Sessions</h3>
                  {[
                    {
                      device: "Chrome on Windows 11",
                      location: "Mumbai, India",
                      time: "Current session",
                      current: true,
                    },
                    {
                      device: "Safari on iPhone 15",
                      location: "Mumbai, India",
                      time: "2 hours ago",
                      current: false,
                    },
                  ].map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{session.device}</p>
                        <p className="text-xs text-slate-500">
                          {session.location} · {session.time}
                        </p>
                      </div>
                      {session.current ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-rose-900 mb-1">Danger Zone</h3>
                  <p className="text-xs text-rose-700 mb-4">
                    These actions are irreversible. Please be absolutely certain before proceeding.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="text-sm font-semibold text-rose-700 border border-rose-300 bg-white px-4 py-2 rounded-xl hover:bg-rose-50 transition-colors">
                      Clear All Local Data
                    </button>
                    <button className="text-sm font-semibold text-white bg-rose-600 px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
