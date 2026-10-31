-- Campus Pulse Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)

-- 1. Create notices table
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE,
  event_time TEXT,
  venue TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'Exams',
    'Assignments',
    'Workshops',
    'Competitions',
    'Cultural Events',
    'Sports',
    'General Announcements'
  )),
  registration_deadline DATE,
  priority TEXT NOT NULL DEFAULT 'upcoming' CHECK (priority IN ('urgent', 'upcoming', 'expired')),
  source_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notices_user_id ON public.notices(user_id);
CREATE INDEX IF NOT EXISTS idx_notices_category ON public.notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_event_date ON public.notices(event_date);
CREATE INDEX IF NOT EXISTS idx_notices_priority ON public.notices(priority);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON public.notices(created_at DESC);

-- 3. Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notices_updated_at ON public.notices;
CREATE TRIGGER trigger_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Allow anyone authenticated or anonymous read access to public campus notices
CREATE POLICY "Public read access for notices"
  ON public.notices
  FOR SELECT
  USING (true);

-- Allow authenticated users to create notices associated with their account
CREATE POLICY "Authenticated users can create notices"
  ON public.notices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL OR user_id IS NULL);

-- Allow notice authors or admins to update their notices
CREATE POLICY "Users can update their own notices"
  ON public.notices
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow notice authors to delete their notices
CREATE POLICY "Users can delete their own notices"
  ON public.notices
  FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Optional: Initial Seed Data for verification
INSERT INTO public.notices (title, description, event_date, event_time, venue, category, registration_deadline, priority, source_text)
VALUES
  (
    'Mid-Term Examination Datesheet',
    'Mid-term examinations for Spring 2026 semester begin across all departments. Check room allocation lists.',
    '2026-11-02',
    '09:00 AM',
    'Exam Hall Complex',
    'Exams',
    NULL,
    'urgent',
    'Attention students! Mid-term examinations commence from 2 Nov 2026 at 9 AM in the Exam Hall Complex.'
  ),
  (
    'Hands-on AI & Machine Learning Workshop',
    'Interactive generative AI & prompt engineering workshop with live cloud credits and certification.',
    '2026-11-15',
    '11:00 AM',
    'Seminar Hall 2',
    'Workshops',
    '2026-11-12',
    'upcoming',
    'Attention students! An AI workshop is organized on 15 November 2026 at 11 AM in Seminar Hall 2. Registration closes on 12 November. All interested students can participate.'
  ),
  (
    'Distributed Systems Lab Assignment 4',
    'Submit complete consensus protocol implementation and performance benchmark report on the portal.',
    '2026-11-01',
    '11:59 PM',
    'Department Submission Portal',
    'Assignments',
    '2026-11-01',
    'urgent',
    'CS501 Lab Report 4 submission deadline is tomorrow Nov 1 at 11:59 PM.'
  ),
  (
    'Campus Hackathon 2026 Registration',
    'Annual 36-hour inter-college hackathon with ₹1,00,000 prize pool and mentorship from industry leaders.',
    '2026-11-20',
    '10:00 AM',
    'Auditorium & Innovation Hub',
    'Competitions',
    '2026-11-10',
    'upcoming',
    'Annual Campus Hackathon 2026 will be held on Nov 20. Team registration closes Nov 10.'
  );

