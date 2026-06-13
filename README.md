# 🌿 BreathSpace AI 
**A RAG-Powered Human Thought & Emotion Transformation System**

![BreathSpace](assets/splash.png)

## What is BreathSpace?
Standard mental wellness trackers just "track" your stress. BreathSpace actively *transforms* it. Built specifically for students facing extreme exam pressure (JEE, NEET, UPSC, GATE), BreathSpace is a calm, conversational AI companion that uses advanced **Retrieval-Augmented Generation (RAG)** and behavioral psychology to break negative thought loops.

## 🚀 The 100/100 Novelty Features
We went beyond standard GenAI chatbots and implemented 5 deeply psychological frameworks directly into the Gemini Agent architecture:

1. 🔄 **Thought Loop Breaker**: Analyzes your RAG history to detect and interrupt repetitive negative spirals.
2. 🪞 **Confidence Mirror**: Reflects your hidden resilience back to you based on your past entries.
3. 🧠 **Inner Voice Reframer**: Automatically intercepts and reframes harsh negative self-talk.
4. 🫀 **Body-Mind Sync**: Connects physical exhaustion to mental burnout intelligently.
5. 🌙 **Recovery Mode**: A specialized next-day emotional reset after a high-stress day.

## 🛠 Tech Stack
- **React Native (Expo)**: Beautiful, smooth, and cross-platform UI.
- **Supabase**: PostgreSQL database with Row Level Security (RLS) and Google OAuth.
- **Google Gemini API**: `gemini-1.5-flash` powering the multi-agent transformation system with Long-Context RAG memory.

## 📦 Local Setup
1. Clone the repository and run `npm install`.
2. Ensure you have the Supabase URL, Supabase Anon Key, and Gemini API Key.
3. Create a `.env.local`:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_url
   EXPO_PUBLIC_SUPABASE_KEY=your_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```
4. Run `npx expo start` and press `a` for Android, `i` for iOS, or `w` for Web.

## 🔐 Security
Your thoughts are yours. Row Level Security ensures isolated data, and the Gemini Safety Prompts guarantee a non-judgmental, non-clinical, empathetic environment.
