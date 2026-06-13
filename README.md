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

## Architecture

BreathSpace is built with a modular React Native architecture:
- `components/`: Reusable UI elements (e.g., `JournalInput`, `ChatBubble`).
- `screens/`: Application views managed by React Navigation.
- `services/`: External integrations (Supabase, Gemini API).
- `utils/`: Helpers and global state management (`AppContext`).

## Security

- **Input Validation**: All user inputs (text, audio, images) are strictly validated for type safety (`typeof input === 'string'`) and non-empty values before processing.
- **Safe AI Execution**: Strict empathetic prompting prevents harmful outputs.
- **Row Level Security (RLS)**: Supabase RLS policies ensure users only access their own data.
- **Async Safety**: All asynchronous API calls are wrapped in robust `try/catch` blocks.

## Error Handling

- **Graceful Failures**: The application avoids silent failures. If an API call fails, the error is caught and logged securely.
- **UI Fallbacks**: Users receive explicit, friendly error messages (e.g., "Something went wrong. Try again.") without application crashes.
- **State Management**: Error states are explicitly tracked in component state to trigger fallback UI rendering.

## Testing

A comprehensive test suite is located in `__tests__/`, covering:
- `unit.test.ts`: Core application logic and structure.
- `input.test.ts`: Validation against empty, null, long text, and special characters.
- `ai.test.ts`: Verification of AI response structure, string types, length, and absence of harmful outputs.
- `async.test.ts`: Graceful handling of API successes, failures, and timeouts.
- `ui.test.tsx`: Component rendering, button interactivity, and loading state visibility.
- `safety.test.ts`: Ensuring extreme or negative emotional inputs are reframed safely.

## Accessibility & UX Perfection

- **Zero Friction Flow**: Guaranteed no dead ends. Empathetic fallbacks for all empty inputs, camera permission denials, or AI timeout states. All async flows implement explicit Loading, Error, and Retry options.
- **Roles & Labels**: All interactive elements (`TouchableOpacity`, `TextInput`) possess `accessible={true}`, explicit `accessibilityRole`s (e.g., 'button', 'alert'), and descriptive `accessibilityLabel`s.
- **Visual Clarity**: Minimum 16px font sizes throughout for strict accessibility compliance.
- **Contrast**: High contrast text/background ratios via the `theme` system.
- **Cognitive Load**: Minimalist, single-action screens reduce overwhelm.

## Performance

- **Duplicate Call Prevention**: Buttons are equipped with `disabled={isLoading}` guards to prevent rapid/duplicate submissions.
- **Optimized Rendering**: React state updates are batched, and flat structures avoid re-render loops.
- **Lightweight Components**: The UI relies on performant, native-backed vector icons (`lucide-react-native`) and optimized gradient rendering.

---

## 🗺 Roadmap

- [ ] Dev Build with `expo-av` for native high-quality voice recording
- [ ] `expo-camera` environment capture in Live screen
- [ ] Push notifications for daily check-in reminders
- [ ] Streak tracking and resilience milestones
- [ ] Offline journaling with sync on reconnect
