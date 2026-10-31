"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Bell,
  PlusCircle,
  Calendar,
  CheckSquare,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Database,
  HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { isSupabaseConfigured } from "@/lib/services/notices";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/notices/new", label: "Add Notice", icon: PlusCircle, badge: "AI" },
  { href: "/notices", label: "All Notices", icon: Bell, badge: null },
  { href: "/calendar", label: "Calendar", icon: Calendar, badge: null },
  { href: "/reminders", label: "Reminders", icon: CheckSquare, badge: null },
  { href: "/summary", label: "AI Summary", icon: Sparkles, badge: "Gemini" },
  { href: "/settings", label: "Settings", icon: Settings, badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const isSupa = isSupabaseConfigured();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-[#0f172a] border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 select-none",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-slate-800", collapsed && "justify-center px-0")}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <Activity className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white tracking-tight leading-none">Campus Pulse</span>
              <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                {isSupa ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Database className="h-2.5 w-2.5" /> Cloud DB
                  </span>
                ) : (
                  <span className="text-blue-300 flex items-center gap-1">
                    <HardDrive className="h-2.5 w-2.5" /> Local Mode
                  </span>
                )}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 relative",
                collapsed && "justify-center px-0 py-3",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3", isActive && "text-white")} />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className={cn(
                  "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  item.badge === "Gemini"
                    ? "bg-violet-500 text-white pulse-badge"
                    : item.badge === "AI"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-700 text-slate-300"
                )}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      <div className={cn("p-3 border-t border-slate-800", collapsed && "px-0")}>
        <div className={cn("flex items-center gap-3 rounded-xl bg-slate-800/60 px-3 py-2.5", collapsed && "justify-center px-0 py-3 bg-transparent")}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md">
            {user?.fullName?.charAt(0) || <User className="h-4 w-4" />}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || "Student Guest"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.department || "Campus Portal"}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-600 hover:text-white transition-all z-10 shadow-lg cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
}
