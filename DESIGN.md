# getdesign.md - BreathSpace AI Design System & Specification

## 1. 🌿 DESIGN PHILOSOPHY

**Calm-first interaction design**
The app prioritizes a tranquil experience, reducing noise and focusing on the user's immediate emotional state.

**Emotional safety principles**
We create a space where users feel understood, without judgment, clinical evaluation, or harsh insights. The Safety Agent ensures no extreme advice is ever given.

**Low cognitive load experience**
Interactions require minimal thought or effort. No metrics, no dashboards, no complex UI.

## 2. 🎨 DESIGN TOKENS

### Colors
- **Light theme (primary calm palette):** Soft white background, light green/blue accents, dark gray text.
- **Dark theme (low strain):** Deep navy background, soft white text.

### Typography
- **Font family:** Inter / System UI
- **Font sizes:** Large, readable defaults.
- **Line spacing:** Breathable (e.g., 1.5 to 1.6).

### Spacing
- **Padding system:** Generous padding.
- **Margin rules:** Clear separation.

## 3. 🧩 COMPONENT LIBRARY

- **CalmCard:** Gently displays AI reflections. Soft rounded corners, subtle shadows, pastel backgrounds.
- **JournalInput:** Safe space for freeform expression. Borderless large text area, minimal UI chrome.
- **ChatBubble:** Conversational support interface. Soft, non-rigid shapes.
- **SuggestionBlock:** Offers ONE simple, gentle idea. Distinct but calm styling.
- **ClosureMessage:** Soft end to the session. Centered, dominant but calming.

## 4. 🌬️ MICRO-INTERACTIONS

- **Breathing animation:** Slow, rhythmic expansion and contraction on the splash screen.
- **Soft fade transitions:** No harsh cuts between screens.
- **Button press feedback:** Gentle scale down and soft color shift.

## 5. 🧠 CONTENT & COPY GUIDELINES

**DO Use:** Gentle tone, empathetic language, short sentences.
**DO NOT Use:** Commands, instruction overload, clinical terms, guilt language.

*Example transformation (Insight Generation Agent):*
- ❌ “You are stressed level 8”
- ✅ “It feels like things have been heavy lately…”

## 6. 📱 SCREEN RULES & EMOTION-FIRST FLOW

- **Splash:** Instant calm entry. "Take a breath."
- **Entry:** Emotional grounding. “I’m here.”
- **Journal:** Free writing without limits.
- **Insight (AI Reflection):** “What I notice.”
- **Chat:** Real-time conversational AI companion.
- **Night Closure:** “You did enough today. Rest.”

## 7. ⚖️ UX DECISION PRINCIPLES

For every feature added, validate:
👉 **“Does this reduce stress?”**
If not: remove OR simplify.

## 8. ♿ ACCESSIBILITY DESIGN

- **Minimum font size:** Large defaults.
- **Contrast ratios:** High contrast but soft colors.
- **Readability rules:** No dense paragraphs.
- **Touch target sizes:** Large, easily tappable areas.

## 9. 🌙 THEMING SYSTEM

- **Light theme:** Default.
- **Dark mode:** Optional toggle.

## 10. CONSISTENCY RULE

All UI, AI responses, and interactions must feel:
✅ Calm
✅ Human
✅ Supportive

Never:
❌ mechanical
❌ overwhelming

## 11. BRANDING & LOGO SYSTEM
**Logo Feel:** Calm, Soft, Minimal, Premium.
**Concept:** A soft circular shape representing a breathing effect, with a subtle gradient from light green to light blue, containing a minimal icon of air/ripple.
**Variants:** Light mode (soft white bg), Dark mode (deep navy bg).

## 12. NAVIGATION SYSTEM (BOTTOM NAVBAR)
**Structure:**
- 🌿 Home (Journal + Entry)
- 🧠 Insights (AI Reflection + Patterns)
- 💬 Companion (Chat AI)
- 🌙 Reflect (Closure)

**Rules:**
- Minimal icons (outline style like Ionicons/Feather).
- No cluttered labels.
- Highlight active tab softly with primary accent color.
- Floating container with soft shadow and rounded corners.

## 13. ADVANCED COMPANION FEATURES
**Somatic Detection:** AI detects physical symptoms ("heavy chest", "headaches") and links them to emotional states gently without medicalizing.
**Context Awareness:** Deep understanding of Indian student stressors (JEE, NEET, UPSC, family expectations).
**Adaptive Response:** Tone, length, and interventions adapt based on emotional intensity. High stress = high empathy, low advice. Low stress = gentle suggestions.
**Multi-Modal UX:** Optional camera and mic inputs placed subtly without cluttering the screen.

---
*Documentation Rule: Whenever UI/UX or AI agent behavior is updated, update this design.md. Ensure PRD and README stay aligned with it.*
