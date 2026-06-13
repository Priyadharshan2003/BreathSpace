# BreathSpace AI 🌿

*A space to pause, breathe, and feel supported.*

BreathSpace AI is a context-aware emotional intelligence system powered by a multi-agent Gemini AI architecture. Designed for students facing high-stakes exams, it provides a judgment-free zone to express emotions and receive personalized, empathetic support.

## Features
- **Contextual Memory & Personalization:** Infers emotional patterns across sessions and stores them in Supabase to provide long-term, context-aware support.
- **Somatic Detection:** AI gently identifies physical manifestations of anxiety without medicalizing.
- **Cultural Empathy:** Specifically tuned to understand the pressures of Indian competitive exams (JEE, NEET, UPSC) and familial expectations.
- **Multi-Modal AI System (Gemini):** Dedicated agents for Emotion Analysis, Insight Generation, Pattern Detection, Coping Strategies, and Safety Moderation, including optional image inputs.
- **Calm-First UX & Branding:** Soft circular logo representing a breathing effect, coupled with a programmatic breathing splash screen.
- **Floating Bottom Navigation:** Minimalist outline-icon tab bar for seamless routing between Home, Insights, Companion, and Reflect tabs.
- **Signature Night Closure:** A soft end to the day ("You did enough today. Rest.").

## Tech Stack
- **Frontend:** React Native (Expo) for Mobile and Web.
- **Backend:** Supabase (Database + Auth + RLS).
- **AI:** Google Gemini API (`@google/generative-ai`).
- **Deployment:** Vercel (for Expo Web).

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Priyadharshan2003/BreathSpace.git
   cd BreathSpace
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm install @google/generative-ai @supabase/supabase-js
   ```

3. **Environment Variables**
   Create a `.env` file at the root of the project:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the Development Server**
   ```bash
   npx expo start
   ```

## Design & Architecture
- For a complete UI/UX system specification, please see [getdesign.md](./getdesign.md).
- For a breakdown of the multi-agent AI behavior and logic, please see [PRD.md](./PRD.md).

## License
MIT License. See [LICENSE](./LICENSE) for more information.
