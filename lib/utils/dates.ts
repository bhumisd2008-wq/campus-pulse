import { NoticePriority } from "@/lib/schemas/notice";

/**
 * Returns the current date in Asia/Kolkata (IST, UTC+05:30) as a Date object.
 */
export function getNowInIST(): Date {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + istOffset);
}

/**
 * Formats a Date object or string into YYYY-MM-DD in IST.
 */
export function formatDateToISTString(date: Date = getNowInIST()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD string into a Date at start of day in IST.
 */
export function parseDateString(dateStr: string, timeStr?: string | null): Date | null {
  if (!dateStr || dateStr === "Not specified") return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  let hours = 23;
  let minutes = 59;

  if (timeStr && timeStr.trim()) {
    const t = timeStr.trim().toLowerCase();
    const isPM = t.includes("pm");
    const isAM = t.includes("am");
    const clean = t.replace(/(am|pm)/g, "").trim();
    const timeParts = clean.split(":");
    if (timeParts.length >= 1) {
      let h = parseInt(timeParts[0], 10);
      const m = timeParts.length >= 2 ? parseInt(timeParts[1], 10) : 0;
      if (isPM && h < 12) h += 12;
      if (isAM && h === 12) h = 0;
      hours = isNaN(h) ? 23 : h;
      minutes = isNaN(m) ? 59 : m;
    }
  }

  return new Date(year, month, day, hours, minutes, 0);
}

/**
 * Computes dynamic status for an event date.
 * - URGENT: Event is within next 24 hours.
 * - UPCOMING: Event is > 24 hours away.
 * - EXPIRED: Event date/time has passed.
 */
export function computeEventStatus(
  eventDate?: string | null,
  eventTime?: string | null
): NoticePriority {
  if (!eventDate || eventDate === "Not specified") return "upcoming";

  const targetDate = parseDateString(eventDate, eventTime);
  if (!targetDate) return "upcoming";

  const now = getNowInIST();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs < 0) {
    // If it's today's date, it shouldn't be immediately expired until day is truly over
    const todayStr = formatDateToISTString(now);
    if (eventDate === todayStr && diffMs > -4 * 60 * 60 * 1000) {
      return "urgent";
    }
    return "expired";
  }

  // Within 24 hours (86,400,000 ms)
  if (diffMs <= 24 * 60 * 60 * 1000) {
    return "urgent";
  }

  return "upcoming";
}

/**
 * Computes registration deadline status.
 */
export function computeRegistrationStatus(
  deadlineDate?: string | null
): "open" | "urgent" | "closed" | "none" {
  if (!deadlineDate || deadlineDate === "Not specified") return "none";

  const target = parseDateString(deadlineDate);
  if (!target) return "none";

  const now = getNowInIST();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs < 0) return "closed";
  if (diffMs <= 24 * 60 * 60 * 1000) return "urgent";
  return "open";
}

/**
 * Overall notice priority based on event and registration deadline.
 * Note: An event does NOT expire just because registration deadline closed!
 */
export function calculateNoticePriority(
  eventDate?: string | null,
  eventTime?: string | null,
  registrationDeadline?: string | null
): NoticePriority {
  const regStatus = computeRegistrationStatus(registrationDeadline);
  const evtStatus = computeEventStatus(eventDate, eventTime);

  // If registration is closing within 24h, it's urgent
  if (regStatus === "urgent") return "urgent";

  // If event is happening within 24h, it's urgent
  if (evtStatus === "urgent") return "urgent";

  // If both have passed (or event has passed and no event remains)
  if (evtStatus === "expired" && (!registrationDeadline || regStatus === "closed")) {
    return "expired";
  }

  if (evtStatus === "upcoming") return "upcoming";

  return "upcoming";
}

/**
 * Checks if a given date string matches today in IST.
 */
export function isTodayInIST(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  const todayStr = formatDateToISTString();
  return dateStr === todayStr;
}

/**
 * Checks if a date string is tomorrow in IST.
 */
export function isTomorrowInIST(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  const now = getNowInIST();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowStr = formatDateToISTString(tomorrow);
  return dateStr === tomorrowStr;
}

/**
 * Checks if a date string is within the current week in IST.
 */
export function isThisWeekInIST(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  const now = getNowInIST();
  const parsed = parseDateString(dateStr);
  if (!parsed) return false;

  const currentDayOfWeek = now.getDay();
  const startOfWeek = new Date(now.getTime() - currentDayOfWeek * 24 * 60 * 60 * 1000);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
  endOfWeek.setHours(23, 59, 59, 999);

  return parsed >= startOfWeek && parsed <= endOfWeek;
}

/**
 * Checks if a date string is within the current month in IST.
 */
export function isThisMonthInIST(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  const now = getNowInIST();
  const parsed = parseDateString(dateStr);
  if (!parsed) return false;

  return parsed.getMonth() === now.getMonth() && parsed.getFullYear() === now.getFullYear();
}

/**
 * Formats date into e.g. "Nov 15, 2026"
 */
export function formatFriendlyDate(dateStr?: string | null): string {
  if (!dateStr || dateStr === "Not specified") return "Not specified";
  const parsed = parseDateString(dateStr);
  if (!parsed) return dateStr;

  return parsed.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
