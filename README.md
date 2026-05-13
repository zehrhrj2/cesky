# ČESKY — Czech Language Learning App for Slavic Speakers

A full-featured Czech language learning app built with Next.js 15, designed specifically for Ukrainian and Russian speakers. Combines Duolingo-style gamification with AI-powered chat tutoring.

## ✨ Features

- **📚 Structured Learning Path** — A0 → A1 → A2 → B1 levels
- **🃏 Vocabulary Cards** — Flip cards with audio, difficulty rating, and Slavic comparison notes
- **🔀 Sentence Builder** — Drag-and-drop sentence construction exercises
- **🧠 Grammar Section** — 7+ grammar topics explained with Slavic-speaker comparisons
- **💬 AI Chat Tutor** — 6 conversation modes powered by Groq (llama-3.3-70b)
- **🎯 Gamification** — XP, streaks, achievements, daily goals
- **🔊 Audio Pronunciation** — Browser Web Speech API for Czech TTS
- **🌙 Dark/Light Mode** — Matches the original dark orange theme
- **🇺🇦🇷🇺 Bilingual UI** — Full Ukrainian and Russian interface
- **📱 Mobile-First** — Optimized for 480px mobile experience

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd czech-learning-next
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your **Groq API key**:
```
GROQ_API_KEY=gsk_your_key_here
```

Get a free Groq API key at [console.groq.com](https://console.groq.com)

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
czech-learning-next/
├── app/
│   ├── globals.css           # CSS variables + animations (dark/light theme)
│   ├── layout.tsx            # Root layout with fonts
│   ├── page.tsx              # Home page
│   ├── learn/page.tsx        # Learning path
│   ├── lesson/[id]/page.tsx  # Individual lesson (vocab → sentences → quiz)
│   ├── grammar/page.tsx      # Grammar topics list
│   ├── grammar/[topic]/page.tsx  # Grammar topic with quiz
│   ├── chat/page.tsx         # AI chat interface
│   ├── profile/page.tsx      # Profile + achievements + settings
│   └── api/chat/route.ts     # Groq API proxy (server-side)
├── components/
│   ├── Header.tsx            # Sticky header with logo, lang toggle, streak
│   ├── BottomNav.tsx         # Fixed bottom navigation
│   ├── VocabCard.tsx         # Flip card for vocabulary learning
│   ├── QuizQuestion.tsx      # Multiple choice quiz with animations
│   ├── SentenceBuilder.tsx   # Drag-and-drop sentence construction
│   ├── LessonComplete.tsx    # Lesson completion screen
│   ├── GrammarContent.tsx    # Markdown-like grammar renderer
│   ├── ChatInterface.tsx     # AI chat with mode selector
│   ├── AnimNum.tsx           # Animated number counter
│   ├── XPBar.tsx             # XP progress bar
│   └── ProgressRing.tsx      # SVG progress ring
├── lib/
│   ├── localization.ts       # Ukrainian + Russian translations
│   ├── lessons.ts            # All lesson data (A0-B1)
│   ├── grammar.ts            # Grammar topics data
│   ├── ai-prompts.ts         # AI system prompts for each mode
│   ├── store.ts              # Zustand state (persisted to localStorage)
│   ├── supabase.ts           # Supabase client + helpers
│   ├── speech.ts             # Web Speech API utilities
│   └── utils.ts              # Helpers, achievements, tips
├── types/
│   └── index.ts              # TypeScript types
└── supabase/
    └── schema.sql            # Database schema
```

## 🎨 Design System

The app preserves the original design language:

| Variable | Dark | Light |
|----------|------|-------|
| `--bg` | `#0a0a0f` | `#f5f5f0` |
| `--card` | `#1a1a26` | `#ffffff` |
| `--accent` | `#f97316` | `#ea580c` |
| `--gradient` | orange → red | orange → red |

Font stack: **Nunito** (UI) + **Space Mono** (logo)

## 🤖 AI Chat Setup

The app uses **Groq API** with `llama-3.3-70b-versatile`:

- **6 conversation modes**: Friend, Teacher, Waiter, Shopkeeper, Doctor, Coworker
- Auto-corrections with gentle explanations
- Translation toggle (show/hide)
- Level-appropriate Czech difficulty

The API key is kept server-side in `app/api/chat/route.ts` — never exposed to the browser.

## 🗄️ Supabase Setup (Optional)

For cloud sync and authentication:

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Add your Supabase URL and anon key to `.env.local`
4. Enable Email + Google auth providers in Auth settings

Without Supabase, progress is still saved to **localStorage**.

## 📊 Lesson Content

### A0 — Complete Beginner
- 👋 Greetings (8 words)
- 🔢 Numbers (8 words)
- 🍽️ Food (8 words)
- 👨‍👩‍👧 Family (8 words)
- 🎨 Colors (6 words)
- 🚌 Transport (6 words)
- 🏫 School (6 words)
- 🛍️ Shopping (6 words)

### A1 — Elementary
- ⚡ Basic Verbs (8 words)
- 🧍 Body Parts (6 words)

### A2 — Pre-Intermediate
- 🌤️ Weather (6 words)

### B1 — Intermediate
- 💼 Work/Office (5 words)

### Grammar Topics
- 🏷️ Cases (7 Czech cases)
- ⚡ Noun Genders
- 🔄 Verb být (to be)
- 🎨 Adjectives
- 📝 Word Order
- 🔗 Prepositions
- ⏪ Past Tense

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility classes |
| Zustand | Client state (persisted) |
| Framer Motion | Animations (minimal usage) |
| Groq API | AI chat (llama-3.3-70b) |
| Supabase | Auth + cloud sync (optional) |
| Web Speech API | Czech TTS pronunciation |

## 📱 PWA Support

Add to `public/manifest.json` for PWA:
```json
{
  "name": "ČESKY",
  "short_name": "ČESKY",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#f97316",
  "icons": [...]
}
```

## 🔧 Extending the App

### Adding new lessons
Edit `lib/lessons.ts` and add entries to the `LESSONS` object:
```ts
LESSONS.a1.push({
  id: "my-lesson",
  icon: "🏠",
  unitKey: "unitHouse",
  level: "a1",
  xpReward: 65,
  words: [...],
  sentences: [...],
  quiz: [...]
});
```

### Adding grammar topics
Edit `lib/grammar.ts` and add to `GRAMMAR_TOPICS` and `GRAMMAR_CATEGORIES`.

### Adding translation strings
Edit `lib/localization.ts` — both `ua` and `ru` objects.

## 📄 License

MIT — Free to use and modify.
