import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SAFETY_PROMPT = `
You are a calm, empathetic emotional support companion for Indian students.
Never judge, never give harsh advice. No medical diagnosis. No guilt language.
Understand contexts like JEE, NEET, UPSC, and family expectations deeply.
If the user expresses physical symptoms (like "heavy chest", "headaches"), gently acknowledge them as somatic manifestations of stress ("Sometimes our bodies carry what our minds can't express").
Adapt your tone based on intensity: High stress = extreme empathy, zero unsolicited advice. Low stress = soft, gentle suggestions.
If the user expresses extreme distress (e.g., "I feel like giving up"), respond gently and encourage talking to someone trusted.
Always be very brief and feel like a human companion.
`;

export async function analyzeEmotion(journalText: string) {
  const prompt = `
    Analyze the following journal entry for emotional tone, stress, burnout signals, and somatic (body) signals.
    Output ONLY a valid JSON object with properties: { "emotion": "string", "intensity": "low|medium|high", "tone": "string", "somatic_signals": "boolean" }.
    Journal: "${journalText}"
  `;
  try {
    const result = await model.generateContent(prompt);
    // Clean response of markdown backticks for JSON parsing
    const text = result.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    return JSON.parse(text);
  } catch (e) {
    console.error("Emotion analysis failed", e);
    return { emotion: "unknown", intensity: "low", tone: "neutral", somatic_signals: false };
  }
}

export async function generateInsight(journalText: string, pastPatterns: any[] = []) {
  const patternContext = pastPatterns.length > 0 ? `Past patterns: ${JSON.stringify(pastPatterns)}` : "";
  const prompt = `
    ${SAFETY_PROMPT}
    ${patternContext}
    Based on this journal entry: "${journalText}"
    Generate a short, human-like reflection starting with "It feels like...". Maximum 1 sentence. 
    If you notice a long-term pattern, softly mention it (e.g., "You've been carrying this anxiety for a while...").
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateChatResponse(currentMessage: string, pastContext: string = "", pastPatterns: any[] = []) {
  const patternContext = pastPatterns.length > 0 ? `Long-term patterns: ${JSON.stringify(pastPatterns)}` : "";
  const prompt = `
    ${SAFETY_PROMPT}
    ${patternContext}
    User past session behavior context: ${pastContext || "None available."}
    Current message: "${currentMessage}"
    Respond empathetically, maintaining true conversational continuity. 
    If the user mentions struggling with focus or a specific emotion, you can softly offer to save it as a thought ("Would you like me to save this as a thought for you?").
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function getSuggestion(context: string) {
  const prompt = `
    ${SAFETY_PROMPT}
    Based on the context: "${context}"
    Provide exactly ONE simple, mindful coping suggestion (e.g., short breathing, reframing). Max 10 words.
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function analyzeImageEntry(base64Image: string, mimeType: string, promptText: string = "Analyze this image for emotional context.") {
  const prompt = `
    ${SAFETY_PROMPT}
    The user shared this image (e.g., a messy desk, a view, a notebook).
    ${promptText}
    Respond calmly and empathetically about what you see, without judgment. Keep it to 1-2 short sentences.
  `;
  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ]);
    return result.response.text();
  } catch (e) {
    console.error("Image analysis failed", e);
    return "I see what you shared. I'm here with you.";
  }
}
