# PRD: BreathSpace AI

## 1. Product Vision
Most mental health apps are clinical dashboards or tracking tools. BreathSpace AI is different: it is a **Human Thought & Emotion Transformation System**. Built for high-pressure students (JEE, NEET, UPSC), it acts as an empathetic digital companion that uses advanced psychology and Generative AI to actively dismantle stress.

## 2. Core Architecture: RAG-Augmented Transformation Engine
We utilize a **Retrieval-Augmented Generation (RAG)** approach without heavy vector databases. By dynamically injecting the user's past 20 journal entries directly into the Gemini 1.5 Flash 1M token context window, the AI gains profound long-term memory of the user's emotional state.

### The 5 Novelty Pillars (Top 1% Features)
1. **Thought Loop Breaker**: The AI analyzes the RAG context to detect repetitive negative thinking cycles (e.g., repeating "I will fail"). It actively interrupts the loop by gently challenging the thought.
2. **Inner Voice Reframer**: Negative self-talk is automatically detected and reframed. "I am useless" becomes "You are facing a very hard moment, but this does not define your progress."
3. **Body-Mind Sync**: The AI connects physical somatic signals (chest tightness, fatigue) directly to emotional burnout, addressing the physiological toll of exam prep.
4. **Confidence Mirror**: Using the RAG memory, the AI reflects the user's strength back to them. ("You've been showing up every day this week despite the stress. That takes immense resilience.")
5. **Recovery Mode**: A next-day emotional reset protocol. If the RAG context shows severe burnout yesterday, the AI starts today with: "Yesterday was heavy, but tomorrow is a fresh page."

## 3. Tech Stack
- **Frontend**: React Native (Expo) - Seamless iOS, Android, and Web experience.
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Google OAuth).
- **AI Core**: Gemini API (gemini-1.5-flash) with Context Injection (RAG).

## 4. User Flow
1. **Secure Auth**: Google OAuth via Supabase.
2. **Entry**: "Take a breath" Lottie animation to reduce cognitive load immediately.
3. **Journal**: A distraction-free space to dump thoughts or use voice/camera context.
4. **Insights (RAG-Powered)**: The app generates a 1-sentence profound reflection based on historical data.
5. **Chat**: A multi-agent conversational interface employing radical empathy.

## 5. Security & Privacy
- Supabase RLS ensures users can only read/write their own journal entries.
- Gemini Prompts are strictly sandboxed to prevent clinical diagnosis or harmful advice.
