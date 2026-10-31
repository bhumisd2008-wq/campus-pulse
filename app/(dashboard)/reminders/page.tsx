"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Clock,
  AlertTriangle,
  Check,
  Trash2,
  X,
  BookOpen,
  Calendar,
  Zap,
  GraduationCap,
} from "lucide-react";

const INITIAL_REMINDERS = [
  {
    id: "1",
    title: "Cloud Computing Lab Report 4",
    course: "CS501",
    dueDate: "2026-11-01",
    dueTime: "11:59 PM",
    priority: "urgent",
    category: "assignment",
    completed: false,
    notes: "Upload to Moodle portal. Include screenshots of EC2 setup.",
  },
  {
    id: "2",
    title: "SE Capstone Milestone 1 — SRS Document",
    course: "CS410",
    dueDate: "2026-11-03",
    dueTime: "11:59 PM",
    priority: "urgent",
    category: "project",
    completed: false,
    notes: "SRS template is on the shared drive. Needs faculty signature.",
  },
  {
    id: "3",
    title: "Semester Fee Payment",
    course: "Accounts Portal",
    dueDate: "2026-11-05",
    dueTime: "11:59 PM",
    priority: "high",
    category: "administrative",
    completed: false,
    notes: "Late fee ₹500/day after deadline. Use online portal or accounts section.",
  },
  {
    id: "4",
    title: "DBMS Assignment 5 — Query Optimization",
    course: "CS302",
    dueDate: "2026-11-04",
    dueTime: "05:00 PM",
    priority: "high",
    category: "assignment",
    completed: false,
    notes: "Covers B+ trees, indexing. Submit as PDF on portal.",
  },
  {
    id: "5",
    title: "Register for Annual Sports Day",
    course: "Sports Committee",
    dueDate: "2026-11-04",
    dueTime: "04:00 PM",
    priority: "medium",
    category: "event",
    completed: false,
    notes: "Register for at least one individual event. Sports complex counter 9AM-4PM.",
  },
  {
    id: "6",
    title: "Operating Systems Quiz 3",
    course: "CS303",
    dueDate: "2026-11-07",
    dueTime: "10:00 AM",
    priority: "medium",
    category: "examination",
    completed: true,
    notes: "Topics: CPU scheduling, memory management, deadlock detection.",
  },
  {
    id: "7",
    title: "Submit Internship NOC Form",
    course: "Student Affairs",
    dueDate: "2026-11-10",
    dueTime: "04:00 PM",
    priority: "low",
    category: "administrative",
    completed: true,
    notes: "Download form from college portal. Get signed by HOD before submission.",
  },
];

const PRIORITY_CONFIG: Record<
  string,
  { label: string; class: string; border: string; dot: string }
> = {
  urgent: {
    label: "Urgent",
    class: "bg-rose-100 text-rose-700",
    border: "border-l-rose-500",
    dot: "bg-rose-500",
  },
  high: {
    label: "High",
    class: "bg-orange-100 text-orange-700",
    border: "border-l-orange-500",
    dot: "bg-orange-500",
  },
  medium: {
    label: "Medium",
    class: "bg-blue-100 text-blue-700",
    border: "border-l-blue-400",
    dot: "bg-blue-400",
  },
  low: {
    label: "Low",
    class: "bg-slate-100 text-slate-600",
    border: "border-l-slate-300",
    dot: "bg-slate-400",
  },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  assignment: BookOpen,
  project: Zap,
  administrative: Calendar,
  event: Calendar,
  examination: GraduationCap,
};

function getDaysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function DueDateLabel({ date }: { date: string }) {
  const days = getDaysUntil(date);
  if (days < 0) return <span className="text-slate-400 text-[11px]">Overdue</span>;
  if (days === 0) return <span className="text-rose-600 font-bold text-[11px]">Due Today!</span>;
  if (days === 1) return <span className="text-rose-500 font-semibold text-[11px]">Tomorrow</span>;
  if (days <= 3) return <span className="text-orange-500 font-semibold text-[11px]">In {days} days</span>;
  return <span className="text-slate-500 text-[11px]">In {days} days</span>;
}

type Reminder = (typeof INITIAL_REMINDERS)[0];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    course: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    category: "assignment",
    notes: "",
  });
  const [addError, setAddError] = useState("");

  const toggle = (id: string) =>
    setReminders((p) => p.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));

  const deleteReminder = (id: string) =>
    setReminders((p) => p.filter((r) => r.id !== id));

  const filtered = reminders
    .filter((r) => {
      if (filter === "pending") return !r.completed;
      if (filter === "completed") return r.completed;
      return true;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const pending = reminders.filter((r) => !r.completed);
  const urgent = pending.filter(
    (r) => r.priority === "urgent" || (r.priority === "high" && getDaysUntil(r.dueDate) <= 3)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.title.trim()) {
      setAddError("Title is required.");
      return;
    }
    if (!newReminder.dueDate) {
      setAddError("Due date is required.");
      return;
    }
    setReminders((p) => [
      ...p,
      { ...newReminder, id: Date.now().toString(), completed: false },
    ]);
    setNewReminder({
      title: "",
      course: "",
      dueDate: "",
      dueTime: "",
      priority: "medium",
      category: "assignment",
      notes: "",
    });
    setShowAddForm(false);
    setAddError("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Reminders & Deadlines</h1>
            <p className="text-xs text-slate-500">
              {pending.length} pending • {urgent.length} urgent
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
        >
          {showAddForm ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add Reminder
            </>
          )}
        </button>
      </div>

      <div className="p-6 max-w-4xl space-y-5">
        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              New Reminder
            </h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Computing Assignment 4"
                  value={newReminder.title}
                  onChange={(e) =>
                    setNewReminder((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Course / Source
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS501"
                  value={newReminder.course}
                  onChange={(e) =>
                    setNewReminder((p) => ({ ...p, course: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Due Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={newReminder.dueDate}
                  onChange={(e) =>
                    setNewReminder((p) => ({ ...p, dueDate: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Priority</label>
                <select
                  value={newReminder.priority}
                  onChange={(e) =>
                    setNewReminder((p) => ({ ...p, priority: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Category</label>
                <select
                  value={newReminder.category}
                  onChange={(e) =>
                    setNewReminder((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="assignment">Assignment</option>
                  <option value="project">Project</option>
                  <option value="examination">Examination</option>
                  <option value="event">Event</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional details or instructions..."
                  value={newReminder.notes}
                  onChange={(e) =>
                    setNewReminder((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {addError && (
                <p className="sm:col-span-2 text-xs text-rose-500 font-medium">{addError}</p>
              )}
              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["all", "pending", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm font-semibold px-4 py-2 rounded-xl border transition-colors capitalize ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200 text-slate-600 hover:bg-white bg-white"
              }`}
            >
              {f}{" "}
              {f === "pending"
                ? `(${pending.length})`
                : f === "completed"
                ? `(${reminders.filter((r) => r.completed).length})`
                : `(${reminders.length})`}
            </button>
          ))}
        </div>

        {/* Reminder Cards */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <CheckSquare className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                {filter === "completed"
                  ? "No completed reminders yet."
                  : "No pending reminders! You're all caught up. 🎉"}
              </p>
            </div>
          )}
          {filtered.map((reminder) => {
            const Icon = CATEGORY_ICONS[reminder.category] || BookOpen;
            const cfg = PRIORITY_CONFIG[reminder.priority];
            return (
              <div
                key={reminder.id}
                className={`group bg-white rounded-2xl border border-slate-200 border-l-4 ${cfg.border} shadow-sm p-5 transition-all hover:shadow-md ${
                  reminder.completed ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggle(reminder.id)}
                    className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      reminder.completed
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-300 hover:border-blue-500"
                    }`}
                  >
                    {reminder.completed && (
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.class}`}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {reminder.category}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-bold text-slate-900 mb-1 ${
                        reminder.completed ? "line-through text-slate-400" : ""
                      }`}
                    >
                      {reminder.title}
                    </p>
                    {reminder.notes && (
                      <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                        {reminder.notes}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-blue-600">{reminder.course}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {reminder.dueDate}
                        {reminder.dueTime && ` • ${reminder.dueTime}`}
                      </span>
                      {!reminder.completed && <DueDateLabel date={reminder.dueDate} />}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
