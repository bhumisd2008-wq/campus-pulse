import { z } from "zod";

export const NOTICE_CATEGORIES = [
  "Exams",
  "Assignments",
  "Workshops",
  "Competitions",
  "Cultural Events",
  "Sports",
  "General Announcements",
] as const;

export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

export const NOTICE_PRIORITIES = ["urgent", "upcoming", "expired"] as const;
export type NoticePriority = (typeof NOTICE_PRIORITIES)[number];

/**
 * Schema for Gemini AI extraction result from unstructured text.
 */
export const ExtractedNoticeSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .describe("Clear, concise headline of the announcement or event"),
  description: z
    .string()
    .min(1, "Description is required")
    .describe("Detailed description of what is happening or required"),
  eventDate: z
    .string()
    .nullable()
    .optional()
    .describe("Date of event in YYYY-MM-DD format, or null if not specified"),
  eventTime: z
    .string()
    .nullable()
    .optional()
    .describe("Time of event in HH:mm format (24h) or e.g. 11:00 AM, or null if not specified"),
  venue: z
    .string()
    .nullable()
    .optional()
    .describe("Location, room, hall or online link, or null if not specified"),
  category: z
    .enum(NOTICE_CATEGORIES)
    .catch("General Announcements")
    .describe("Best matching category"),
  registrationDeadline: z
    .string()
    .nullable()
    .optional()
    .describe("Registration, submission or cutoff date in YYYY-MM-DD format, or null if not specified"),
  priority: z
    .enum(["urgent", "upcoming", "expired"])
    .catch("upcoming")
    .describe("Urgency level based on proximity to date"),
});

export type ExtractedNotice = z.infer<typeof ExtractedNoticeSchema>;

/**
 * Schema for creating/updating a Notice in Supabase / Data Layer.
 */
export const NoticeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(160, "Title is too long"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  event_date: z.string().nullable().optional(),
  event_time: z.string().nullable().optional(),
  venue: z.string().nullable().optional(),
  category: z.enum(NOTICE_CATEGORIES),
  registration_deadline: z.string().nullable().optional(),
  priority: z.enum(NOTICE_PRIORITIES).default("upcoming"),
  source_text: z.string().nullable().optional(),
});

export type NoticeFormData = z.infer<typeof NoticeFormSchema>;
