"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  Calendar,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Star,
  ChevronRight,
  Mail,
  Menu,
  X,
  BookOpen,
  Clock,
  TrendingUp,
  MessageSquare,
  Globe,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Bell,
    title: "Smart Announcements",
    description: "Never miss critical circulars. AI-categorized notices with priority labels, filters, and department-specific views.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Calendar,
    title: "Campus Calendar",
    description: "Integrated event timeline for workshops, seminars, examinations, and cultural fests — all in one unified schedule.",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: CheckSquare,
    title: "Deadline Tracker",
    description: "Smart reminders for assignment submissions, fee deadlines, project milestones and registration cutoffs.",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Sparkles,
    title: "AI Weekly Briefing",
    description: "Gemini-powered summaries that synthesize all campus activity into a concise, personalized weekly digest.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Separate views for students, faculty, and administrators with Supabase authentication.",
    color: "from-rose-500 to-rose-600",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Globe,
    title: "Department-Wide Reach",
    description: "Cross-department broadcasting with targeted delivery to specific courses, semesters, or student groups.",
    color: "from-teal-500 to-teal-600",
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Students Sign In",
    description: "Secure authentication via Supabase. Your academic profile syncs department and enrolled courses automatically.",
    icon: Lock,
  },
  {
    step: "02",
    title: "Receive Personalized Notices",
    description: "Announcements are intelligently filtered based on your department, semester, and course load.",
    icon: Bell,
  },
  {
    step: "03",
    title: "Track Deadlines & Events",
    description: "Add reminders for assignments. Important campus events populate your calendar with one click.",
    icon: Calendar,
  },
  {
    step: "04",
    title: "Get AI-Generated Summaries",
    description: "Campus Pulse synthesizes the week's most important updates into a crisp AI briefing every Monday morning.",
    icon: Sparkles,
  },
];

const STATS = [
  { label: "Active Students", value: "12,500+", icon: Users },
  { label: "Notices Published", value: "3,200+", icon: Bell },
  { label: "Events Managed", value: "840+", icon: Calendar },
  { label: "Departments Covered", value: "28", icon: BookOpen },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">Campus Pulse</span>
                <span className="ml-1.5 text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">BETA</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#stats", label: "About" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4 space-y-3">
              {["Features", "How It Works", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="block text-sm font-medium text-slate-600 hover:text-blue-600 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link
                href="/dashboard"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-5 py-3 rounded-xl mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-28 pb-24 overflow-hidden gradient-hero">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-blue-600/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-yellow-400" />
            <span>Powered by Google Gemini AI • Now in Beta</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Your Campus Life,
            <br />
            <span className="gradient-text">All in One Place.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Campus Pulse is the AI-powered information hub that unifies announcements, events, assignment deadlines, and campus activities so you never miss what matters.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all text-base"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm text-base"
            >
              Explore Features
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <Icon className="h-5 w-5 text-blue-400 mb-2 mx-auto" />
                  <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              PLATFORM FEATURES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Everything your campus needs,{" "}
              <span className="gradient-text">intelligently organized</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              From real-time announcements to AI-generated weekly briefings, Campus Pulse handles your entire campus information lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 card-hover"
                >
                  <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Zap className="h-3.5 w-3.5" />
              HOW IT WORKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Simple. Fast. <span className="gradient-text">Intelligent.</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Get up and running in minutes. Campus Pulse is designed for every student, from freshers to final year.
            </p>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-[calc(100%-200px)] h-0.5 bg-gradient-to-r from-blue-200 via-violet-300 to-blue-200" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOW_IT_WORKS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/25 relative z-10">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-lg z-20">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="stats" className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Star className="h-3.5 w-3.5" />
            JOIN THOUSANDS OF STUDENTS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Ready to take control of{" "}
            <span className="gradient-text">your campus life?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Sign up for free and get instant access to all Campus Pulse features. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your college email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            />
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all whitespace-nowrap"
            >
              <Mail className="h-4 w-4" />
              Get Access
            </Link>
          </div>
          <p className="text-slate-500 text-xs mt-4">Free for all students. No spam, ever.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Campus Pulse</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                An AI-powered campus information management platform built for modern college students. Built with Next.js, Supabase, and Google Gemini.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "All Notices", href: "/notices" },
                  { label: "Calendar", href: "/calendar" },
                  { label: "Reminders", href: "/reminders" },
                  { label: "AI Summary", href: "/summary" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Built With</h4>
              <ul className="space-y-2.5 text-sm">
                {["Next.js 16 App Router", "TypeScript", "Tailwind CSS v4", "Supabase", "Google Gemini AI", "Lucide React"].map((tech) => (
                  <li key={tech} className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2026 Campus Pulse. Built for Buildathon.</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
