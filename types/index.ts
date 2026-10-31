import { NoticeCategory, NoticePriority } from "@/lib/schemas/notice";

export interface Notice {
  id: string;
  user_id?: string | null;
  title: string;
  description: string;
  event_date?: string | null;
  event_time?: string | null;
  venue?: string | null;
  category: NoticeCategory;
  registration_deadline?: string | null;
  priority: NoticePriority;
  source_text?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role?: "student" | "faculty" | "admin";
  department?: string;
  semester?: string | number;
  rollNumber?: string;
}

export interface ReminderItem {
  id: string;
  noticeId?: string;
  title: string;
  category: NoticeCategory;
  dueDate: string;
  dueTime?: string;
  priority: NoticePriority;
  enabled: boolean;
  notes?: string;
  source: "notice" | "custom";
}

export interface WeeklySummaryResult {
  weekRange: string;
  generatedAt: string;
  headline: string;
  overview: string;
  importantEvents: Array<{ title: string; date: string; time?: string; venue?: string }>;
  examinations: Array<{ title: string; date: string; details?: string }>;
  deadlines: Array<{ title: string; deadline: string; urgent: boolean }>;
  workshopsAndCompetitions: Array<{ title: string; date: string; venue?: string }>;
  actionItems: string[];
}
