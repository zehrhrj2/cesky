-- ============================================================
-- ČESKY App — Supabase Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  lang TEXT DEFAULT 'ua' CHECK (lang IN ('ua', 'ru')),
  xp INTEGER DEFAULT 0 NOT NULL,
  streak INTEGER DEFAULT 0 NOT NULL,
  words_learned INTEGER DEFAULT 0 NOT NULL,
  lessons_completed INTEGER DEFAULT 0 NOT NULL,
  completed_units TEXT[] DEFAULT '{}',
  chat_messages_count INTEGER DEFAULT 0,
  daily_lessons_today INTEGER DEFAULT 0,
  daily_goal INTEGER DEFAULT 3,
  last_streak_date DATE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- WORD PROGRESS TABLE (Spaced Repetition)
-- ============================================================
CREATE TABLE IF NOT EXISTS word_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word_cz TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  next_review TIMESTAMPTZ DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  last_reviewed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, word_cz)
);

ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their word progress"
  ON word_progress FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- QUIZ ATTEMPTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their quiz attempts"
  ON quiz_attempts FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- CHAT HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their chat history"
  ON chat_history FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- ACHIEVEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their achievements"
  ON user_achievements FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCTION: Calculate next review date (spaced repetition)
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_next_review(
  difficulty TEXT,
  review_count INTEGER
)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  days_until_review INTEGER;
BEGIN
  IF difficulty = 'easy' THEN
    days_until_review := GREATEST(1, review_count * 3);
  ELSIF difficulty = 'medium' THEN
    days_until_review := GREATEST(1, review_count);
  ELSE -- hard
    days_until_review := 0; -- Review again same day
  END IF;

  RETURN NOW() + (days_until_review || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_word_progress_user_review
  ON word_progress(user_id, next_review);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user
  ON quiz_attempts(user_id, completed_at);

CREATE INDEX IF NOT EXISTS idx_chat_history_user
  ON chat_history(user_id, updated_at);

-- ============================================================
-- SAMPLE DATA for development (optional)
-- ============================================================
-- This would be inserted via Supabase Studio or API
-- Example vocabulary entries are managed in-app via JSON data
