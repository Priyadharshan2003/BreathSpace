import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { generateChatResponse, transcribeAudio } from '../services/aiService';
import { saveChatMessage, fetchChatHistory } from '../services/supabaseService';

// ─────────────────────────────────────────────────────────────────────────────
// NO expo-av / expo-speech imports here.
// Both crash Expo Go because they reference ExponentAV native module at
// bundle time — try/catch does NOT prevent Metro from loading them.
//
// This hook uses:
//   • Web Speech API (SpeechRecognition) for voice input  → works in Expo Go
//   • window.speechSynthesis for TTS output               → works in Expo Go
// When you switch to a proper Dev Build, replace these with expo-av + expo-speech.
// ─────────────────────────────────────────────────────────────────────────────

export type LiveState =
  | 'IDLE'
  | 'LISTENING'
  | 'TRANSCRIBING'
  | 'AWAITING_USER'
  | 'THINKING'
  | 'SPEAKING';

// ─── Web Speech helpers ───────────────────────────────────────────────────────

function getSpeechRecognition(): any | null {
  if (Platform.OS !== 'web') return null; // only works in web/Expo Go web
  if (typeof window === 'undefined') return null;
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  return new SR();
}

function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function speakText(text: string, onDone: () => void) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(text);
    u.onend = onDone;
    u.onerror = onDone;
    window.speechSynthesis.speak(u);
  } else {
    // No TTS available — just mark done immediately
    onDone();
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLiveConvo(ragContext: any[] = []) {
  const [state, setState] = useState<LiveState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadHistory();
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    };
  }, []);

  const loadHistory = async () => {
    try {
      const history = await fetchChatHistory(10);
      setChatHistory(history);
    } catch (_) {}
  };

  // ─── Voice input via Web Speech API ────────────────────────────────────────

  const startListening = () => {
    stopSpeaking();
    setTranscript('');
    setAiResponse('');

    const recognition = getSpeechRecognition();
    if (!recognition) {
      // SpeechRecognition not available (native Expo Go on device) →
      // fall straight to text input mode so the user can type.
      setState('AWAITING_USER');
      return;
    }

    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setState('LISTENING');

    recognition.onresult = (event: any) => {
      const text: string = event.results[0][0].transcript;
      setTranscript(text);
      setState('AWAITING_USER');
    };

    recognition.onerror = () => setState('AWAITING_USER');
    recognition.onend = () => {
      // If still listening when it ends unexpectedly, open text mode
      setState((prev) => (prev === 'LISTENING' ? 'AWAITING_USER' : prev));
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    setState('AWAITING_USER');
  };

  // ─── Submit message → Gemini ────────────────────────────────────────────────

  const submitMessage = async (text: string) => {
    if (!text || text.trim() === '') {
      setState('IDLE');
      return;
    }
    setState('THINKING');

    try {
      await saveChatMessage('user', text);

      const historyStr = chatHistory
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');

      const reply = await generateChatResponse(text, historyStr, [], ragContext);

      setAiResponse(reply);
      await saveChatMessage('ai', reply);
      loadHistory();

      setState('SPEAKING');
      speakText(reply, () => setState('IDLE'));
    } catch (e) {
      console.error('generateChatResponse error:', e);
      setState('IDLE');
    }
  };

  return {
    state,
    transcript,
    setTranscript,
    aiResponse,
    startListening,
    stopListening,
    submitMessage,
    setState,
  };
}
