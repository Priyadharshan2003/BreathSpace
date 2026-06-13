# Interaction Modes and Animation Rules

The Live Conversation experience in BreathSpace relies on precise, minimal interaction modes and soothing animations to maintain a calm, human-like connection. 

## 1. Interaction Modes

### A. Talk Mode (Voice)
- **Primary Input**: `expo-av` audio recording.
- **Goal**: Minimize typing and reduce cognitive load. Provide a frictionless way to speak thoughts.
- **Fallback**: Transcribed text is displayed for review before the final submission, allowing the user to correct or expand on the text.

### B. Capture Mode (Video/Image)
- **Primary Input**: `expo-camera` environment capture.
- **Goal**: Allow users to share visual context (e.g., a messy study desk, notes) without forcing a text description.
- **Safety**: Face tracking is avoided. The AI is prompted to analyze the *environment* and offer empathy ("I see your workspace is busy..."), ensuring the interaction never feels invasive.

### C. Write Mode (Text)
- **Primary Input**: Text Input field.
- **Goal**: Provide a silent, manual fallback for users in quiet environments (e.g., library) or for those who find speaking too exhausting.

---

## 2. Animation Rules

### A. The Orb (Status Indicator)
The central visual element of the Live Screen is the glowing Orb. It represents the AI's current state and acts as a psychological anchor.

- **IDLE / AWAITING_USER**: The orb is a neutral, dark border color (`#374151`).
- **LISTENING**: The orb turns a soft, trusting blue (`#3B82F6`). In future iterations, this can pulse gently with the microphone waveform.
- **TRANSCRIBING**: The orb turns a warm amber/yellow (`#F59E0B`), signaling that the system is processing the audio into text.
- **THINKING**: The orb transitions to a deep purple (`#8B5CF6`). This indicates the Gemini AI is formulating an empathetic response.
- **SPEAKING**: The orb glows a calming emerald green (`#10B981`) while the AI's voice plays.

### B. Soft Transitions
- No sudden UI jumps. Ensure the text flows into the screen smoothly.
- The mode switch buttons ("Talk instead", "Write instead") should remain subtle at the bottom of the screen to avoid distracting from the core conversation.
- Camera overlays must use a heavy dark tint (`rgba(0,0,0,0.6)`) so the live video feed doesn't overpower the text or the calm aesthetic.
