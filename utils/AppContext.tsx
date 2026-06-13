import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { fetchUserPatterns } from '../services/supabaseService';

interface AppContextType {
  journalText: string;
  setJournalText: (text: string) => void;
  insight: string;
  setInsight: (text: string) => void;
  suggestion: string;
  setSuggestion: (text: string) => void;
  chatHistory: { text: string; isAI: boolean }[];
  setChatHistory: (history: { text: string; isAI: boolean }[]) => void;
  pastPatterns: any[];
  setPastPatterns: (patterns: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [journalText, setJournalText] = useState('');
  const [insight, setInsight] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ text: string; isAI: boolean }[]>([]);
  const [pastPatterns, setPastPatterns] = useState<any[]>([]);

  useEffect(() => {
    const loadPatterns = async () => {
      const patterns = await fetchUserPatterns(5);
      setPastPatterns(patterns);
    };
    loadPatterns();
  }, []);

  return (
    <AppContext.Provider
      value={{
        journalText,
        setJournalText,
        insight,
        setInsight,
        suggestion,
        setSuggestion,
        chatHistory,
        setChatHistory,
        pastPatterns,
        setPastPatterns,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
