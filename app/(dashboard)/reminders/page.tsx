"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  Plus,
  Bell,
  BellOff,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Trash2,
  X,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { Notice, ReminderItem } from "@/types";
import { getNotices } from "@/lib/services/notices";
import {
  formatFriendlyDate,
  computeEventStatus,
  computeRegistrationStatus,
  isTodayInIST,
  isTomorrowInIST,
} from "@/lib/utils/dates";
import { useToast } from "@/context/toast-context";

const LOCAL_REMINDERS_KEY = "campus_pulse_custom_reminders_v1";

export default function RemindersPage() {
  const { success, error: toastError, info } = useToast();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [customReminders, setCustomReminders] = useState<ReminderItem[]>([]);
  const [disabledNoticeIds, setDisabledNoticeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Add reminder modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDueTime, setNewDueTime] = useState("11:59 PM");
  const [newCategory, setNewCategory] = useState("Assignments");
  const [newNotes, setNewNotes] = useState("");

  // Browser notification status
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    async function loadData() {
      try {
        setLoading(true);
        const data = await getNotices();
        setNotices(data);

        // Load custom reminders
        const rawCustom = localStorage.getItem(LOCAL_REMINDERS_KEY);
        if (rawCustom) {
          setCustomReminders(JSON.parse(rawCustom));
        }

        // Load disabled notice reminders
        const rawDisabled = localStorage.getItem("campus_pulse_disabled_notice_reminders");
        if (rawDisabled) {
          setDisabledNoticeIds(new Set(JSON.parse(rawDisabled)));
        }
      } catch (err) {
        console.error("Error loading reminders:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Request browser notification permission
  const handleRequestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toastError("Not Supported", "Browser notifications are not supported in your browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        success("Notifications Enabled!", "You will receive timely desktop reminders for upcoming deadlines.");
        new Notification("Campus Pulse Reminders", {
          body: "Campus Pulse reminders are now active on your device.",
          icon: "/favicon.ico",
        });
      } else {
        info("Permission Status", `Notification permission is ${permission}.`);
      }
    } catch (e) {
      toastError("Error", "Could not request notification permissions.");
    }
  };

  // Toggle reminder for a notice
  const handleToggleNoticeReminder = (noticeId: string) => {
    setDisabledNoticeIds((prev) => {
      const next = new Set(prev);
      if (next.has(noticeId)) {
        next.delete(noticeId);
        success("Reminder Enabled", "You will be alerted for this event.");
      } else {
        next.add(noticeId);
        info("Reminder Muted", "Alerts muted for this notice.");
      }
      localStorage.setItem("campus_pulse_disabled_notice_reminders", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Add custom reminder
  const handleCreateCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) {
      toastError("Validation Error", "Please provide title and due date.");
      return;
    }

    const item: ReminderItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory as any,
      dueDate: newDueDate,
      dueTime: newDueTime,
      priority: "upcoming",
      enabled: true,
      notes: newNotes.trim() || undefined,
      source: "custom",
    };

    const updated = [item, ...customReminders];
    setCustomReminders(updated);
    localStorage.setItem(LOCAL_REMINDERS_KEY, JSON.stringify(updated));

    setShowAddModal(false);
    setNewTitle("");
    setNewDueDate("");
    setNewNotes("");
    success("Reminder Created", `"${item.title}" added to your reminders.`);
  };

  // Toggle custom reminder enabled
  const handleToggleCustomReminder = (id: string) => {
    const updated = customReminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setCustomReminders(updated);
    localStorage.setItem(LOCAL_REMINDERS_KEY, JSON.stringify(updated));
  };

  // Delete custom reminder
  const handleDeleteCustomReminder = (id: string) => {
    const updated = customReminders.filter((r) => r.id !== id);
    setCustomReminders(updated);
    localStorage.setItem(LOCAL_REMINDERS_KEY, JSON.stringify(updated));
    success("Reminder Deleted", "Custom reminder removed.");
  };

  // Combine and categorize all reminders
  const { urgentList, upcomingList, completedList } = useMemo(() => {
    const urgent: any[] = [];
    const upcoming: any[] = [];
    const completed: any[] = [];

    // Notice reminders
    for (const n of notices) {
      const dateToUse = n.registration_deadline || n.event_date;
      if (!dateToUse) continue;

      const isEnabled = !disabledNoticeIds.has(n.id);
      const regStatus = computeRegistrationStatus(n.registration_deadline);
      const evtStatus = computeEventStatus(n.event_date, n.event_time);

      const isUrgent = regStatus === "urgent" || evtStatus === "urgent";
      const isPast = evtStatus === "expired" && (!n.registration_deadline || regStatus === "closed");

      const item = {
        id: `notice-${n.id}`,
        noticeId: n.id,
        title: n.title,
        category: n.category,
        dueDate: dateToUse,
        dueTime: n.event_time || (n.registration_deadline ? "11:59 PM" : undefined),
        priority: isUrgent ? "urgent" : isPast ? "expired" : "upcoming",
        enabled: isEnabled,
        notes: n.venue ? `Venue: ${n.venue}` : undefined,
        source: "notice",
        isRegistration: Boolean(n.registration_deadline),
      };

      if (isPast) {
        completed.push(item);
      } else if (isUrgent) {
        urgent.push(item);
      } else {
        upcoming.push(item);
      }
    }

    // Custom reminders
    for (const c of customReminders) {
      if (!c.enabled) {
        completed.push(c);
      } else if (c.priority === "urgent" || isTodayInIST(c.dueDate) || isTomorrowInIST(c.dueDate)) {
        urgent.push(c);
      } else {
        upcoming.push(c);
      }
    }

    return { urgentList: urgent, upcomingList: upcoming, completedList: completed };
  }, [notices, customReminders, disabledNoticeIds]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Reminders & Urgent Deadlines</h1>
            <p className="text-xs text-slate-500">
              {urgentList.length} urgent • {upcomingList.length} upcoming alerts (Asia/Kolkata IST)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Notification Permission Pill */}
          <button
            onClick={handleRequestNotificationPermission}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              notificationPermission === "granted"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            {notificationPermission === "granted" ? "Browser Alerts Active" : "Enable Browser Alerts"}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Custom Reminder
          </button>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Urgent Deadlines Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-base font-bold text-slate-900">
                Urgent Deadlines (Next 24 Hours)
              </h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {urgentList.length} Critical
            </span>
          </div>

          {urgentList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
              No urgent deadlines within the next 24 hours. You&apos;re completely on schedule! 👏
            </div>
          ) : (
            <div className="space-y-3">
              {urgentList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-l-4 border-l-rose-500 border border-slate-200 p-5 shadow-xs flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        URGENT
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                      {isTodayInIST(item.dueDate) && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                          DUE TODAY
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {item.notes && <p className="text-xs text-slate-500">{item.notes}</p>}

                    <div className="flex items-center gap-3 text-xs text-rose-600 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Due: {formatFriendlyDate(item.dueDate)} {item.dueTime && `at ${item.dueTime}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.source === "notice" ? (
                      <button
                        onClick={() => handleToggleNoticeReminder(item.noticeId)}
                        title={item.enabled ? "Mute notification" : "Enable notification"}
                        className={`p-2 rounded-xl transition-colors ${
                          item.enabled
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {item.enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteCustomReminder(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600">
              <Calendar className="h-5 w-5" />
              <h2 className="text-base font-bold text-slate-900">Upcoming Reminders</h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800">
              {upcomingList.length} Upcoming
            </span>
          </div>

          {upcomingList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
              No upcoming reminders found. Add a custom task or check notices.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-start justify-between gap-4 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {item.category}
                      </span>
                      {item.source === "custom" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                          Custom Task
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {item.notes && <p className="text-xs text-slate-500">{item.notes}</p>}

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <CalendarCheck className="h-3.5 w-3.5 text-blue-600" />
                        Target: {formatFriendlyDate(item.dueDate)} {item.dueTime && `(${item.dueTime})`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.source === "notice" ? (
                      <button
                        onClick={() => handleToggleNoticeReminder(item.noticeId)}
                        title={item.enabled ? "Disable alert" : "Enable alert"}
                        className={`p-2 rounded-xl transition-colors ${
                          item.enabled
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {item.enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleCustomReminder(item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          title="Mark complete"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomReminder(item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete reminder"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Reminder Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Custom Reminder</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reminder Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Submit Elective Preference Form"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    placeholder="11:59 PM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Assignments">Assignments</option>
                  <option value="Exams">Exams</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Competitions">Competitions</option>
                  <option value="General Announcements">General Announcements</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes / Course Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Upload to academic dean portal"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
