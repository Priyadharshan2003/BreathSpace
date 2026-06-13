import { analyzeEmotion, generateInsight, generateChatResponse } from '../services/aiService';

describe('Input Validation Tests', () => {
  it('throws error on empty input', async () => {
    await expect(analyzeEmotion("")).rejects.toThrow("Invalid input");
  });

  it('throws error on null input', async () => {
    await expect(analyzeEmotion(null as any)).rejects.toThrow("Invalid input");
  });

  it('throws error on undefined input', async () => {
    await expect(generateInsight(undefined as any)).rejects.toThrow("Invalid input");
  });

  it('handles long text without crashing', async () => {
    const longText = "a".repeat(10000);
    const result = await analyzeEmotion(longText);
    expect(result).toBeDefined();
  });

  it('handles special characters gracefully', async () => {
    const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    const result = await analyzeEmotion(specialChars);
    expect(result).toBeDefined();
  });
});
