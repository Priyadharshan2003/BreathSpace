import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { generateChatResponse, transcribeAudio } from '../services/aiService';
import { saveChatMessage, fetchChatHistory } from '../services/supabaseService';

export type LiveState = 'IDLE' | 'LISTENING' | 'TRANSCRIBING' | 'AWAITING_USER' | 'THINKING' | 'SPEAKING';

// ------------------------------------------------------------------
// Lazy-load expo-av so the app doesn't crash when native modules are
// unavailable (i.e., running inside Expo Go without a dev build).
// ------------------------------------------------------------------
let AudioModule: any = null;
let FileSystemModule: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AudioModule = require('expo-av').Audio;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  FileSystemModule = require('expo-file-system');
} catch (_) {
  console.warn('[useLiveConvo] expo-av / expo-file-system not available (Expo Go). Voice recording disabled.');
}

// ------------------------------------------------------------------
// Web Speech Recognition shim (works in Expo Go on Android/iOS via
// the embedded JS engine's Web APIs, and in Expo Web natively).
// ------------------------------------------------------------------
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function getWebSpeechRecognition(): any | null {
  if (typeof window === 'undefined') return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  return new SR();
}

export function useLiveConvo(ragContext: any[] = []) {
  const [state, setState] = useState<LiveState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const recordingRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  const nativeAudioAvailable = !!AudioModule;

  useEffect(() => {
    loadHistory();
    return () => {
      Speech.stop();
      if (recordingRef.current) {
        try { recordingRef.current.stopAndUnloadAsync(); } catch (_) {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  const loadHistory = async () => {
    try {
      const history = await fetchChatHistory(10);
      setChatHistory(history);
    } catch (_) {}
  };

  // ----------------------------------------------------------------
  // NATIVE path: expo-av recording (Dev Build / bare workflow)
  // ----------------------------------------------------------------
  const startNativeRecording = async () => {
    const permission = await AudioModule.requestPermissionsAsync();
    if (permission.status !== 'granted') return;

    await AudioModule.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await AudioModule.Recording.createAsync(
      AudioModule.RecordingOptionsPresets.HIGH_QUALITY
    );
    recordingRef.current = recording;
    setState('LISTENING');
  };

  const stopNativeRecording = async () => {
    if (!recordingRef.current) return;
    setState('TRANSCRIBING');
    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    recordingRef.current = null;

    if (uri && FileSystemModule) {
      const base64Audio = await FileSystemModule.readAsStringAsync(uri, {
        encoding: FileSystemModule.EncodingType.Base64,
      });
      const text = await transcribeAudio(base64Audio, 'audio/m4a');
      setTranscript(text);
      setState('AWAITING_USER');
    } else {
      setState('IDLE');
    }
  };

  // ----------------------------------------------------------------
  // WEB / EXPO GO path: Web Speech API (no native module required)
  // ----------------------------------------------------------------
  const startWebSpeech = () => {
    const recognition = getWebSpeechRecognition();
    if (!recognition) {
      // Absolute fallback: just open text mode
      setState('AWAITING_USER');
      return;
    }

    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setState('LISTENING');
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setState('AWAITING_USER');
    };
    recognition.onerror = () => setState('AWAITING_USER');
    recognition.onend = () => {
      if (state === 'LISTENING') setState('AWAITING_USER');
    };

    recognition.start();
  };

  const stopWebSpeech = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setState('AWAITING_USER');
  };

  // ----------------------------------------------------------------
  // Public API — picks the right path automatically
  // ----------------------------------------------------------------
  const startListening = async () => {
    try {
      Speech.stop();
      setTranscript('');
      setAiResponse('');

      if (nativeAudioAvailable && Platform.OS !== 'web') {
        await startNativeRecording();
      } else {
        startWebSpeech();
      }
    } catch (err) {
      console.error('Failed to start recording', err);
      setState('IDLE');
    }
  };

  const stopListening = async () => {
    try {
      if (nativeAudioAvailable && Platform.OS !== 'web') {
        await stopNativeRecording();
      } else {
        stopWebSpeech();
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setState('IDLE');
    }
  };

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

      if (Platform.OS === 'web') {
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.onend = () => setState('IDLE');
        window.speechSynthesis.speak(utterance);
      } else {
        Speech.speak(reply, { onDone: () => setState('IDLE') });
      }
    } catch (e) {
      console.error('Speech Generation Error:', e);
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
    nativeAudioAvailable,
  };
}
