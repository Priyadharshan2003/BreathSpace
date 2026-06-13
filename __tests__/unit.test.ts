import { validateInput } from '../services/aiService'; // need to export it if we want to test it. Wait, I didn't export validateInput in aiService.ts!

// I'll create tests that verify behavior based on exported functions.

import { analyzeEmotion, generateInsight, getSuggestion } from '../services/aiService';

describe('Unit Tests', () => {
  it('analyzes emotion returns valid object structure', async () => {
    const result = await analyzeEmotion("I am feeling a bit tired today.");
    expect(result).toHaveProperty('emotion');
    expect(result).toHaveProperty('intensity');
    expect(result).toHaveProperty('tone');
    expect(result).toHaveProperty('somatic_signals');
  });

  it('generateInsight returns a string', async () => {
    const result = await generateInsight("Today was overwhelming.");
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
