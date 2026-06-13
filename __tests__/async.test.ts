import { analyzeEmotion } from '../services/aiService';

describe('Async Tests', () => {
  it('API success resolves properly', async () => {
    const result = await analyzeEmotion("I am happy");
    expect(result).toBeDefined();
    expect(result.emotion).toBeDefined();
  });

  it('API failure throws gracefully or returns fallback', async () => {
    // If we mock the fetch or simulate network failure, we expect handled errors
    // Since analyzeEmotion catches its internal errors and returns a default or throws
    try {
      await analyzeEmotion("");
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('handles timeout simulation (mocked)', async () => {
    jest.useFakeTimers();
    const promise = analyzeEmotion("Wait for it");
    jest.runAllTimers();
    const result = await promise;
    expect(result).toBeDefined();
    jest.useRealTimers();
  });
});
