import { supabase } from "@/lib/supabase/client";
import { Notice } from "@/types";
import { calculateNoticePriority } from "@/lib/utils/dates";

const LOCAL_STORAGE_KEY = "campus_pulse_notices_v1";

export const INITIAL_SEED_NOTICES: Notice[] = [
  {
    id: "seed-1",
    user_id: null,
    title: "Mid-Term Examination Datesheet — Spring 2026",
    description:
      "The finalized datesheet for all theoretical and practical mid-term examinations is published. Students must bring college ID cards. Hall tickets mandatory.",
    event_date: "2026-11-02",
    event_time: "09:00 AM",
    venue: "Examination Hall Complex",
    category: "Exams",
    registration_deadline: null,
    priority: "urgent",
    source_text:
      "Attention students! Mid-term examinations commence on 2 November 2026 at 9:00 AM in the Examination Hall Complex.",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-2",
    user_id: null,
    title: "Hands-on AI & Machine Learning Workshop",
    description:
      "Interactive generative AI & prompt engineering workshop with live cloud credits and certificate of completion.",
    event_date: "2026-11-15",
    event_time: "11:00 AM",
    venue: "Seminar Hall 2",
    category: "Workshops",
    registration_deadline: "2026-11-12",
    priority: "upcoming",
    source_text:
      "Attention students! An AI workshop is organized on 15 November 2026 at 11 AM in Seminar Hall 2. Registration closes on 12 November. All interested students can participate.",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-3",
    user_id: null,
    title: "Distributed Systems Lab Assignment 4",
    description:
      "Submit consensus protocol code repository link and benchmark analysis report on the department portal.",
    event_date: "2026-11-01",
    event_time: "11:59 PM",
    venue: "Course Submission Portal",
    category: "Assignments",
    registration_deadline: "2026-11-01",
    priority: "urgent",
    source_text:
      "CS501 Lab Report 4 submission deadline is tomorrow Nov 1 at 11:59 PM on the Moodle portal.",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-4",
    user_id: null,
    title: "Campus Hackathon 2026 — Team Registration",
    description:
      "Annual 36-hour inter-college hackathon with ₹1,00,000 prize pool. Industry mentors from top tech companies will judge projects.",
    event_date: "2026-11-20",
    event_time: "10:00 AM",
    venue: "Innovation Hub & Auditorium",
    category: "Competitions",
    registration_deadline: "2026-11-10",
    priority: "upcoming",
    source_text:
      "Annual Campus Hackathon 2026 announced! Dates: 20 Nov 2026. Register teams of 3-4 before Nov 10.",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-5",
    user_id: null,
    title: "Annual Sports Meet Registration Open",
    description:
      "Registration for track events, basketball, football, and table tennis. Inter-department trophy tournament.",
    event_date: "2026-11-25",
    event_time: "08:00 AM",
    venue: "Main University Sports Complex",
    category: "Sports",
    registration_deadline: "2026-11-18",
    priority: "upcoming",
    source_text:
      "All sports enthusiasts! Annual Sports Meet 2026 scheduled for 25 Nov. Register with the physical education director before 18 Nov.",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-6",
    user_id: null,
    title: "Cultural Fest 'Tarang 2026' Auditions",
    description:
      "Auditions for college music band, dance troupes, drama club, and fashion society for the annual cultural extravaganza.",
    event_date: "2026-11-08",
    event_time: "04:00 PM",
    venue: "Student Activity Center (SAC)",
    category: "Cultural Events",
    registration_deadline: "2026-11-06",
    priority: "upcoming",
    source_text:
      "Cultural Committee announces auditions for Tarang 2026 on 8 Nov at 4 PM in SAC. Registration closes 6 Nov.",
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "seed-7",
    user_id: null,
    title: "Library Extended Hours for Semester Exam Prep",
    description:
      "Central Library reading halls will remain open 24/7 starting next week. Security personnel on duty.",
    event_date: "2026-11-02",
    event_time: "08:00 AM",
    venue: "Central Library Block",
    category: "General Announcements",
    registration_deadline: null,
    priority: "urgent",
    source_text:
      "Notice: Central Library reading halls will operate 24/7 during the entire exam period beginning 2 Nov 2026.",
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Checks if Supabase credentials are configured and not default placeholders.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes("your-project-id") || key.includes("your-anon-key")) return false;
  return url.startsWith("https://") && key.length > 20;
}

/**
 * Get current storage mode: 'supabase' or 'local-fallback'.
 */
export function getStorageMode(): "supabase" | "local-fallback" {
  return isSupabaseConfigured() ? "supabase" : "local-fallback";
}

// ----------------- LOCAL STORAGE HELPERS -----------------

function getLocalNotices(): Notice[] {
  if (typeof window === "undefined") return INITIAL_SEED_NOTICES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_NOTICES));
      return INITIAL_SEED_NOTICES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_NOTICES));
      return INITIAL_SEED_NOTICES;
    }
    // Recompute dynamic priorities
    return parsed.map((n: Notice) => ({
      ...n,
      priority: calculateNoticePriority(n.event_date, n.event_time, n.registration_deadline),
    }));
  } catch (err) {
    console.error("Error reading localStorage notices:", err);
    return INITIAL_SEED_NOTICES;
  }
}

function saveLocalNotices(notices: Notice[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notices));
  } catch (err) {
    console.error("Error saving localStorage notices:", err);
  }
}

// ----------------- PUBLIC API OPERATIONS -----------------

/**
 * Fetches all notices, ordered by created_at DESC.
 */
export async function getNotices(): Promise<Notice[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error, falling back to local storage:", error.message);
        return getLocalNotices();
      }

      if (data && data.length > 0) {
        return data.map((n) => ({
          ...n,
          priority: calculateNoticePriority(n.event_date, n.event_time, n.registration_deadline),
        }));
      }
    } catch (e) {
      console.warn("Supabase connection exception, using local storage fallback:", e);
      return getLocalNotices();
    }
  }

  return getLocalNotices();
}

/**
 * Fetches a single notice by ID.
 */
export async function getNoticeById(id: string): Promise<Notice | null> {
  const notices = await getNotices();
  return notices.find((n) => n.id === id) || null;
}

/**
 * Creates a new notice.
 */
export async function createNotice(
  noticeData: Omit<Notice, "id" | "created_at" | "updated_at">
): Promise<Notice> {
  const calculatedPriority = calculateNoticePriority(
    noticeData.event_date,
    noticeData.event_time,
    noticeData.registration_deadline
  );

  const payload = {
    ...noticeData,
    priority: calculatedPriority,
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("notices")
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return data as Notice;
      }
      console.warn("Supabase insert error, saving locally:", error?.message);
    } catch (e) {
      console.warn("Supabase insert failed, falling back to local storage:", e);
    }
  }

  // Local fallback
  const newNotice: Notice = {
    ...payload,
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const current = getLocalNotices();
  const updated = [newNotice, ...current];
  saveLocalNotices(updated);
  return newNotice;
}

/**
 * Updates an existing notice by ID.
 */
export async function updateNotice(
  id: string,
  updates: Partial<Omit<Notice, "id" | "created_at">>
): Promise<Notice | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("notices")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return data as Notice;
      }
      console.warn("Supabase update error, updating locally:", error?.message);
    } catch (e) {
      console.warn("Supabase update exception, using local storage:", e);
    }
  }

  // Local fallback
  const current = getLocalNotices();
  const index = current.findIndex((n) => n.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const merged: Notice = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  merged.priority = calculateNoticePriority(
    merged.event_date,
    merged.event_time,
    merged.registration_deadline
  );

  current[index] = merged;
  saveLocalNotices(current);
  return merged;
}

/**
 * Deletes a notice by ID.
 */
export async function deleteNotice(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (!error) return true;
      console.warn("Supabase delete error, deleting locally:", error.message);
    } catch (e) {
      console.warn("Supabase delete exception, falling back to local delete:", e);
    }
  }

  const current = getLocalNotices();
  const updated = current.filter((n) => n.id !== id);
  saveLocalNotices(updated);
  return true;
}

