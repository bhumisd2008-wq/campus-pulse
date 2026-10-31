import React from "react";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Campus Pulse
          </span>
          <span className="text-xs text-slate-400">
            — AI-Powered Campus Information Platform
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Built with Next.js App Router, TypeScript, Tailwind CSS & Supabase.
        </p>
      </div>
    </footer>
  );
}

