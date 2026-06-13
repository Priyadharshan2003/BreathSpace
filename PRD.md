# BreathSpace AI - Upgraded Product Requirements Document (PRD)

## 1. PRODUCT VISION & REDEFINED SYSTEM
BreathSpace AI is a **multi-agent emotional intelligence system powered by the Gemini API**. 
It is a calm, always-available AI companion for students under pressure. It provides a judgment-free zone to express emotions and receive empathetic, micro-supportive interactions.

## 2. MULTI-AGENT ARCHITECTURE (GEMINI API)
Instead of a single AI call, the system relies on specialized AI Agents powered by `@google/generative-ai`.
1. **Emotion Analysis Agent:** Analyzes unstructured journal text to detect emotion type, intensity, and tone.
2. **Insight Generation Agent:** Converts raw emotional data into human reflection (e.g., "It feels like you've been carrying a lot today...").
3. **Pattern Detection Agent:** Evaluates past entries to uncover hidden stress triggers (e.g., "Stress before exams").
4. **Coping Strategy Agent:** Provides exactly ONE simple, mindful suggestion (e.g., short breathing, reframing).
5. **Conversational Companion Agent:** Maintains context in real-time chat, adapting tone dynamically.
6. **Safety & Moderation Agent (CRITICAL):** Filters harmful outputs and extreme distress signals, responding with safer fallbacks.

## 3. MEMORY & PERSONALIZATION SYSTEM
To achieve hyper-personalization, the system uses **stateful AI interaction**:
- **Storage:** Journal entries, detected emotions, and timestamps are securely stored in Supabase.
- **Context Injection:** The LLM prompts include user history (e.g., "User past behavior: Feels stressed before exams. Current message: 'I am not prepared'. Respond empathetically.").

## 4. USER EXPERIENCE (UX) FLOW (EMOTION-FIRST)
1. **Entry:** "Take a breath"
2. **Journal:** Free writing without format limits.
3. **AI Reflection:** "What I notice"
4. **Conversation:** Chat agent responds in real-time.
5. **Suggestion:** One small coping action.
6. **Closure:** "You did enough today. Rest."

## 4.5. BRANDING & NAVIGATION
- **App Logo:** A minimal, calming logo featuring a soft circular shape (breathing effect) and a light green to light blue gradient.
- **Splash Screen:** Implements the logo with a programmatic expanding/contracting breathing animation.
- **Navigation:** A floating bottom tab navbar mapping to Home, Insights, Companion, and Reflect screens for seamless switching while maintaining low friction.

## 5. TECH ARCHITECTURE (PRODUCTION-GRADE)
- **Frontend:** React Native (Expo) - Mobile & Web.
- **Backend:** Supabase (PostgreSQL, Auth, RLS).
- **AI Integration:** `@google/generative-ai` (Gemini Pro).
- **Deployment:** Vercel (Expo Web).

**Modular Structure:**
```
/app
/components
/logic
   emotionalEngine.js
   patternEngine.js
/services
   aiService.js (Gemini implementation)
   supabaseService.js
/utils
/styles
```

## 6. SAFETY & ETHICS
- **Rules:** No medical diagnosis, no guilt language, no extreme advice.
- **Crisis Handling:** If a user expresses extreme distress (e.g., "I feel like giving up"), the Moderation Agent overrides to respond gently and encourages talking to someone trusted.
- **Security:** Strict Supabase Row-Level Security (RLS) ensures users can only access their own data.

## 7. EFFICIENCY & ACCESSIBILITY
- **Efficiency:** Cache previous patterns, avoid redundant API calls, and batch analysis.
- **Accessibility:** Large fonts, calm contrast, simple inputs, and inherently low cognitive load UI.
