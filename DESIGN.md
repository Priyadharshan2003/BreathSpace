# DESIGN.md: The BreathSpace Aesthetic

## Philosophy: "Calm First, Data Second"
BreathSpace is NOT a dashboard. Dashboards induce stress. BreathSpace is a **sanctuary**.
The UI must feel like a quiet room. Every interaction, animation, and color choice must reduce the user's cognitive load.

## 🎨 Color System (The "Forest Dawn" Palette)
We completely avoid medical blues or aggressive reds.
- **Background (`#F9FAFB`)**: Soft, warm off-white. Never pure stark white.
- **Surface (`#FFFFFF`)**: Pure white for elevated cards to create gentle depth.
- **Primary Accent (`#059669`)**: Deep, calming emerald green. Used sparingly for active states and primary actions.
- **Text Primary (`#1F2937`)**: Charcoal grey for ultimate readability without the harsh contrast of pure black.
- **Text Secondary (`#6B7280`)**: Soft slate grey for metadata and timestamps.
- **Danger/Warning (`#EF4444`)**: Used ONLY for destructive actions (like deleting an account), never for emotional states.

## ✍️ Typography
- **Primary Font**: System sans-serif (Inter/SF Pro/Roboto) optimized for legibility.
- **Headings**: Semi-bold, large spacing to feel airy.
- **Body Text**: 16px minimum, 1.5x line height to ensure text feels breathable.

## 🌊 Motion & Micro-interactions
- **Breathing Logo**: The splash screen features a pulsing, gentle Lottie animation that mimics a 4-7-8 breathing technique.
- **Shadows**: We use extreme diffusion (`shadowOpacity: 0.05`, `shadowRadius: 15`) so cards don't look like rigid boxes, but rather soft floating paper.

## 🧠 The "Psychological UX"
The UI is inextricably linked to the AI's psychological framework:
1. **Empty States are Safe States**: When the user has no history, we don't say "No data found." We say "I'm here when you're ready to talk."
2. **Hidden Intelligence**: We do not show the user "Stress Score: 85%". Instead, the AI implicitly uses that 85% to trigger the **Recovery Mode** logic in the background, surfacing as a gentle morning greeting.
3. **The Confidence Mirror UI**: Insights are presented in a single, beautiful "Calm Card" rather than a list of bullet points.
