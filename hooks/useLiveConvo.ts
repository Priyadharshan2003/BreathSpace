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
        };

        recognition.onend = () => {
          // Trigger inference if we were listening and got text
          if (recognitionRef.current && recognitionRef.current._listening) {
            recognitionRef.current._listening = false;
            handleSpeechEnd();
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

  const handleSpeechEnd = async () => {
    setState((curr) => {
       if (curr !== 'LISTENING') return curr;
       return 'THINKING';
    });
    
    // We need a short delay to ensure transcript state is fully updated
    setTimeout(async () => {
      setState((currentState) => {
        if (currentState !== 'THINKING') return currentState;
        
        generateChatResponse(transcript || "Hello", "", [], ragContext)
          .then((reply) => {
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
          })
          .catch(() => setState('IDLE'));
          
        return currentState;
      });
    }, 500);
  };

  return { state, transcript, aiResponse, startListening, stopListening };
}
