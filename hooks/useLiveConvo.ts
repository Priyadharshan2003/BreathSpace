import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { generateChatResponse } from '../services/aiService';

export type LiveState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';

export function useLiveConvo(ragContext: any[] = []) {
  const [state, setState] = useState<LiveState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef(''); // Reference to avoid closure staleness

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          transcriptRef.current = currentTranscript; // Always keep the latest value in a ref
        };

        recognition.onend = () => {
          if (recognitionRef.current && recognitionRef.current._listening) {
            recognitionRef.current._listening = false;
            // Pass the absolute latest transcript from the ref to avoid stale state
            handleSpeechEnd(transcriptRef.current);
          }
        };
        
        recognitionRef.current = recognition;
      }
    }
    return () => {
      Speech.stop();
    };
  }, []);

  const startListening = () => {
    setState('LISTENING');
    setTranscript('');
    transcriptRef.current = '';
    setAiResponse('');
    Speech.stop();
    if (recognitionRef.current) {
      try {
        recognitionRef.current._listening = true;
        recognitionRef.current.start();
      } catch (e) { console.error(e); }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current._listening = false;
      recognitionRef.current.stop();
    }
    setState('IDLE');
  };

  const handleSpeechEnd = async (finalText: string) => {
    setState('THINKING');
    
    try {
      // If the user didn't say anything, don't ping the AI with a blank request
      if (!finalText || finalText.trim() === "") {
        setState('IDLE');
        return;
      }

      const reply = await generateChatResponse(finalText, "", [], ragContext);
      
      setAiResponse(reply);
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

  return { state, transcript, aiResponse, startListening, stopListening };
}
