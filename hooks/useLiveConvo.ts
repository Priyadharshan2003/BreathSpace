import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { generateChatResponse, transcribeAudio } from '../services/aiService';
import { saveChatMessage, fetchChatHistory } from '../services/supabaseService';

export type LiveState = 'IDLE' | 'LISTENING' | 'TRANSCRIBING' | 'AWAITING_USER' | 'THINKING' | 'SPEAKING';

export function useLiveConvo(ragContext: any[] = []) {
  const [state, setState] = useState<LiveState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    loadHistory();
    return () => {
      Speech.stop();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const loadHistory = async () => {
    const history = await fetchChatHistory(10);
    setChatHistory(history);
  };

  const startListening = async () => {
    try {
      Speech.stop();
      setTranscript('');
      setAiResponse('');
      
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setState('LISTENING');
    } catch (err) {
      console.error('Failed to start recording', err);
      setState('IDLE');
    }
  };

  const stopListening = async () => {
    if (!recordingRef.current) return;
    setState('TRANSCRIBING');
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (uri) {
        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Use Gemini to transcribe
        const text = await transcribeAudio(base64Audio, "audio/m4a");
        setTranscript(text);
        setState('AWAITING_USER');
      } else {
        setState('IDLE');
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
      const historyStr = chatHistory.map(m => `${m.role}: ${m.content}`).join("\n");
      const reply = await generateChatResponse(text, historyStr, [], ragContext);
      
      setAiResponse(reply);
      await saveChatMessage('ai', reply);
      loadHistory(); // Refresh history
      
      setState('SPEAKING');
      
      if (Platform.OS === 'web') {
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.onend = () => setState('IDLE');
        window.speechSynthesis.speak(utterance);
      } else {
        Speech.speak(reply, {
          onDone: () => setState('IDLE'),
        });
      }
    } catch (e) {
      console.error("Speech Generation Error:", e);
      setState('IDLE');
    }
  };

  return { state, transcript, setTranscript, aiResponse, startListening, stopListening, submitMessage, setState };
}
