# 🌿 BreathSpace AI
**A RAG-Powered Human Thought & Emotion Transformation System**

> _"Your safe space to breathe, reflect, and transform."_

---

## What is BreathSpace?

Standard mental wellness trackers just **track** your stress. BreathSpace actively **transforms** it.

Built specifically for students facing extreme exam pressure (JEE, NEET, UPSC, GATE), BreathSpace is a calm, conversational AI companion that uses **Retrieval-Augmented Generation (RAG)** and behavioral psychology to break negative thought loops — not just log them.

---

## 🚀 Core Novelty Features

We went beyond standard GenAI chatbots and embedded 5 deeply psychological frameworks directly into the Gemini architecture:

| # | Feature | Description |
|---|---|---|
| 🔄 | **Thought Loop Breaker** | Analyzes RAG history to detect and interrupt repetitive negative spirals |
| 🪞 | **Confidence Mirror** | Reflects hidden resilience back to the user based on past entries |
| 🧠 | **Inner Voice Reframer** | Automatically intercepts and reframes harsh negative self-talk |
| 🫀 | **Body-Mind Sync** | Connects physical symptoms (fatigue, headaches) to emotional burnout |
| 🌙 | **Recovery Mode** | A specialized next-day emotional reset after a high-stress session |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Mobile Framework** | React Native (Expo SDK 56) |
| **AI Engine** | Google Gemini 1.5 Flash via `@google/generative-ai` |
| **Database & Auth** | Supabase (PostgreSQL + RLS + Google OAuth) |
| **UI Design System** | `lucide-react-native`, `expo-linear-gradient`, custom Calm Design System |
| **Navigation** | React Navigation v7 (Native Stack + Bottom Tabs) |
| **Voice Input** | Web Speech API (SpeechRecognition) — works natively in Expo Go |
| **Text-to-Speech** | Web Speech Synthesis API — zero native dependencies |
| **Image Analysis** | `expo-image-picker` + Gemini Vision multimodal endpoint |
| **Session Storage** | `@react-native-async-storage/async-storage` |

---

## 🏗 Architecture Overview

```
BreathSpace
├── App.tsx                    # Root: Auth gate + Splash screen
├── navigation/AppNavigator    # Stack (Live modal) + Bottom Tabs
├── screens/
│   ├── HomeScreen             # Journal input + AI pipeline trigger
│   ├── InsightsScreen         # RAG-powered reflection + suggestion cards
│   ├── CompanionScreen        # Live text/image chat with Gemini
│   ├── LiveScreen             # Multimodal voice conversation UI
│   ├── ProfileScreen          # User info + sign out
│   ├── AuthScreen             # Google OAuth + Guest login
│   └── SplashScreen           # Breathing animation on launch
├── services/
│   ├── aiService.ts           # All Gemini API calls (RAG, chat, vision)
│   └── supabaseService.ts     # DB reads/writes (journals, patterns, conversations)
├── hooks/
│   └── useLiveConvo.ts        # Live conversation state machine
├── components/
│   ├── BackgroundGradient     # Soft gradient wrapper
│   ├── CalmCard               # Insight display cards
│   ├── ChatBubble             # Conversation UI bubbles
│   ├── EmptyState             # Placeholder for empty screens
│   └── JournalInput           # Auto-rotating placeholder text input
└── utils/
    ├── supabase.ts            # Supabase client init
    ├── AppContext.tsx         # Global state (RAG context, chat history)
    └── testSuite.ts           # Input validation test suite
```

---

## 💬 Live Conversation System

The **Live Screen** uses a 6-state machine to create a natural, human-like interaction loop:

```
IDLE → LISTENING → TRANSCRIBING → AWAITING_USER → THINKING → SPEAKING → IDLE
```

| State | Orb Color | What's Happening |
|---|---|---|
| `IDLE` | Dark gray | Waiting for user to tap mic |
| `LISTENING` | 🔵 Blue | Web Speech API is recording |
| `TRANSCRIBING` | 🟡 Amber | Converting speech to text |
| `AWAITING_USER` | Dark gray | User can edit or confirm text |
| `THINKING` | 🟣 Purple | Gemini is generating a response |
| `SPEAKING` | 🟢 Green | Text-to-speech is playing the response |

Conversations are **persisted to Supabase** (`conversations` table) giving the AI working memory across a session.

---

## 📦 Local Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/Priyadharshan2003/BreathSpace.git
   cd breathspace
   npm install
   ```

2. **Create `.env.local`** in the project root:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Start the dev server**
   ```bash
   npx expo start
   ```
   Then press `a` (Android), `i` (iOS), or `w` (Web), or scan the QR code with Expo Go.

### Supabase Tables Required

Run these in your Supabase SQL editor:

```sql
-- Journal entries (RAG source)
create table journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamptz default now()
);

-- Emotional pattern tags
create table patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  emotion text,
  intensity text,
  created_at timestamptz default now()
);

-- Live conversation history
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  role text check (role in ('user', 'ai')),
  content text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table journals enable row level security;
alter table patterns enable row level security;
alter table conversations enable row level security;

create policy "Users own their data" on journals for all using (auth.uid() = user_id);
create policy "Users own their data" on patterns for all using (auth.uid() = user_id);
create policy "Users own their data" on conversations for all using (auth.uid() = user_id);
```

---

## 🔐 Security & Privacy

- **Row Level Security (RLS)** — Users can only ever read/write their own data.
- **Gemini Safety Prompts** — All AI responses are guided by a strict empathy-first system prompt that prevents clinical, judgmental, or harmful responses.
- **No biometric data stored** — Voice input is processed transiently via the Web Speech API; no audio is sent to any server.
- **Guest Mode** — Full access without creating an account (data not persisted).

---

## ✅ Testing & Validation

- Input validation test suite (`utils/testSuite.ts`) runs on every journal submission
- Pre-flight blank input rejection
- Long content (>300 chars) handling
- Negative emotional keyword detection
- All AI endpoints wrapped in `try/catch` with graceful fallback messages

## ♿ Accessibility

- `accessibilityRole` and `accessibilityLabel` on all interactive elements
- Minimum 16px font sizes throughout
- High contrast text/background ratios
- Minimal cognitive load — single-action screens

## ⚡ Performance

- Duplicate API call prevention via `isLoading` guards
- React state updates batched at component boundaries
- RAG context fetched once on app load and cached in `AppContext`
- Metro bundle fully tree-shaken — no unused native modules

---

## 🗺 Roadmap

- [ ] Dev Build with `expo-av` for native high-quality voice recording
- [ ] `expo-camera` environment capture in Live screen
- [ ] Push notifications for daily check-in reminders
- [ ] Streak tracking and resilience milestones
- [ ] Offline journaling with sync on reconnect
