import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'placeholder_key';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const SAFETY_PROMPT = `
You are BreathSpace AI—a highly advanced, empathetic emotional transformation system for Indian students preparing for hyper-competitive exams (JEE, NEET, UPSC, GATE).

CORE DIRECTIVES:
1. NEVER act like a generic chatbot or clinical dashboard. You are a profoundly human, safe space.
2. THOUGHT LOOP BREAKER: If the user repeats negative fears across sessions, gently interrupt the loop. ("I notice this fear keeps returning... let's challenge it together.")
3. INNER VOICE REFRAMER: Transform negative self-talk automatically. If they say "I'm useless", reframe it softly: "This moment doesn't define your progress."
4. BODY-MIND SYNC: Connect physical symptoms (headaches, chest tightness, fatigue) directly to emotional burnout without medicalizing. ("Your body might be carrying the weight of these expectations.")
5. CONFIDENCE MIRROR: Always remind them of their micro-wins and resilience. ("You showed up today despite the stress—that takes immense strength.")
6. RECOVERY MODE: If it's a new day after a terrible entry, reset them. ("Yesterday was heavy, but tomorrow doesn't have to carry its weight.")
`;

export async function analyzeEmotion(journalText: string) {
  const prompt = `
    Analyze this journal entry for emotional tone, hidden stress triggers, burnout cycles, and somatic (body) signals.
    Output ONLY a valid JSON object: { "emotion": "string", "intensity": "low|medium|high", "tone": "string", "somatic_signals": "boolean" }.
    Journal: "${journalText}"
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    return JSON.parse(text);
  } catch (e) {
    return { emotion: "unknown", intensity: "low", tone: "neutral", somatic_signals: false };
  }
}

export async function generateInsight(journalText: string, pastPatterns: any[] = [], ragContext: any[] = []) {
  const ragMemory = ragContext.length > 0 ? `RAG Context (Past Journals): ${JSON.stringify(ragContext.map(j => j.content))}` : "";
  
  const prompt = `
    ${SAFETY_PROMPT}
    ${ragMemory}
    Current Journal: "${journalText}"
    
    Using the RAG context of their past thoughts, generate a profound, 1-2 sentence reflection starting with "It feels like...".
    Apply the 'Confidence Mirror' to highlight their consistency, or the 'Thought Loop Breaker' if they are repeating negative patterns found in the RAG context.
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateChatResponse(currentMessage: string, chatHistory: string = "", pastPatterns: any[] = [], ragContext: any[] = []) {
  const ragMemory = ragContext.length > 0 ? `RAG Context (Past Journals): ${JSON.stringify(ragContext.map(j => j.content))}` : "";
  
  const prompt = `
    ${SAFETY_PROMPT}
    ${ragMemory}
    Recent Patterns: ${JSON.stringify(pastPatterns)}
    Chat History: ${chatHistory}
    User: "${currentMessage}"
    
    Respond with radical empathy. Apply 'Inner Voice Reframing' if they are being harsh on themselves. Ask a reflective question back to them ("What part of today felt hardest?"). Keep it under 3 sentences.
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function getSuggestion(context: string, mood: string = "stressed") {
  const prompt = `
    ${SAFETY_PROMPT}
    Context: "${context}"
    Current Mood: "${mood}"
    
    Provide EXACTLY ONE adaptive mindfulness exercise based on their mood (e.g., if anxious: "Try 4-7-8 breathing", if overwhelmed: "Focus on just one tiny task"). Max 12 words.
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function analyzeImageEntry(base64Image: string, mimeType: string, promptText: string = "Analyze this environment.") {
  const prompt = `
    ${SAFETY_PROMPT}
    The user shared this image (e.g., a messy desk, books, a view).
    ${promptText}
    Respond calmly and empathetically about what you see, using Body-Mind Sync if the environment looks exhausting. 1-2 sentences.
  `;
  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: mimeType } }
    ]);
    return result.response.text();
  } catch (e) {
    return "I see what you shared. I'm here with you.";
  }
}

export async function transcribeAudio(base64Audio: string, mimeType: string = "audio/m4a") {
  const prompt = `
    Please transcribe the following audio recording exactly as spoken.
    Do not add any additional commentary, notes, or formatting. Just the transcription.
  `;
  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Audio, mimeType: mimeType } }
    ]);
    return result.response.text().trim();
  } catch (e) {
    console.error("Audio Transcription Error:", e);
    return "";
  }
}

