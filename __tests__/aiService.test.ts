import { analyzeEmotion, generateInsight } from '../services/aiService';

// Mock the Gemini API
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: jest.fn().mockReturnValue(JSON.stringify({
              emotion: "anxious",
              intensity: "high",
              tone: "fearful",
              somatic_signals: true
            }))
          }
        })
      })
    }))
  };
});

describe('aiService', () => {
  it('should accurately parse emotional JSON from the LLM', async () => {
    const result = await analyzeEmotion("I feel like I can't breathe before my exam.");
    expect(result.emotion).toBe("anxious");
    expect(result.intensity).toBe("high");
    expect(result.somatic_signals).toBe(true);
  });
});
