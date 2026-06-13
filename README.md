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
- **UI/UX**: Premium Calm Design System using `lucide-react-native` and `expo-linear-gradient` for a soft, emotionally engaging experience.
- **Supabase**: PostgreSQL database with Row Level Security (RLS) and Google OAuth.
- **Google Gemini API**: `gemini-1.5-flash` powering the multi-agent transformation system with Long-Context RAG memory.
- **Expo AV & Camera**: Enables high-quality Voice and Video (Environment Capture) interaction modes for deeply natural conversations.

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

## Testing
The app includes validation and test handling for:
- Empty journal input ✅
- Long journaling content ✅
- Negative emotional input ✅
- AI response safety ✅

## Accessibility
- Accessible labels added ✅
- Proper button roles ✅
- Large readable fonts ✅
- High contrast UI ✅
- Minimal cognitive load ✅

## Error Handling
- Robust `try/catch` wrappers around all AI inference endpoints.
- Fallback UI rendering when network or LLM generation fails.

## Input Validation
- Pre-flight blank check: Empty string rejection.
- Input sanitation and length limits enforced.

## Performance Optimization
- Duplicate Request Prevention: API limits are respected by disabling buttons (`isLoading` checks) to prevent race conditions.
- React components avoid unnecessary re-renders.

## Voice and Camera Multimodal Setup
- **Voice Setup**: Uses `expo-av` to record high-quality audio (`m4a`), converts it to base64, and sends it to the Gemini 1.5 Flash API for accurate Speech-To-Text transcription. The response is synthesized using `expo-speech` for a calm auditory experience.
- **Camera Usage**: The environment capture mode uses `expo-camera` to safely share visual context. It avoids direct facial analysis to ensure an emotionally safe and non-invasive interaction. 
- **Permissions**: Safe and strict permission checks are implemented. Video and Audio are never stored on the device or server; they are only temporarily converted to base64 for API transmission.
