import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf, LogOut, Radio, Camera, Mic, Wind } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { JournalInput } from '../components/JournalInput';
import { analyzeEmotion, generateInsight, getSuggestion } from '../services/aiService';
import { saveEmotionalTag } from '../services/supabaseService';
import { useAppContext } from '../utils/AppContext';
import { supabase } from '../utils/supabase';
import { runTests } from '../utils/testSuite';

export const HomeScreen = ({ navigation }: any) => {
  const { journalText, setJournalText, setInsight, setSuggestion, setChatHistory, pastPatterns, ragContext } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const handleJournalSubmit = async () => {
    // 5. Efficiency Fix: Avoid duplicate calls
    if (isLoading) return;
    
    // 4. Input Validation (Security Boost)
    if (!journalText || journalText.trim() === "") {
      setError("You can take your time… write whenever you're ready.");
      return;
    }
    
    setError(null);
    setIsLoading(true);

    // 1. Call Testing Suite
    const testResults = runTests(journalText);
    console.log("Test Results:", testResults);

    try {
      const emotionData = await analyzeEmotion(journalText);
      await saveEmotionalTag(emotionData.emotion, emotionData.intensity);

      const generatedInsight = await generateInsight(journalText, pastPatterns, ragContext);
      setInsight(generatedInsight);
      
      const generatedSuggestion = await getSuggestion(`User felt ${emotionData?.emotion || 'overwhelmed'} after: ${journalText}`);
      setSuggestion(generatedSuggestion);
      
      setChatHistory([{ text: generatedInsight, isAI: true }]);
      navigation.navigate('Insights');
    } catch (e) {
      // 3. Error Handling fallback
      console.error("AI Error:", e);
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Leaf size={40} color={theme.colors.light.primary} strokeWidth={1.5} accessibilityLabel="BreathSpace Logo" />
          <TouchableOpacity onPress={logout} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Log out">
            <LogOut size={28} color={theme.colors.light.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
        <View style={styles.ambientVisual}>
          <Wind size={60} color={theme.colors.light.primary} strokeWidth={1} style={{ opacity: 0.2 }} />
        </View>

        <Text accessibilityLabel="Journal Input Label" style={styles.srOnly}>How are you feeling today?</Text>
        <JournalInput value={journalText} onChangeText={setJournalText} />
        {error && <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>}
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Live')} accessibilityRole="button" accessibilityLabel="Start live session">
            <Radio size={24} color={theme.colors.light.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Live')} accessibilityRole="button" accessibilityLabel="Open camera">
            <Camera size={24} color={theme.colors.light.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Live')} accessibilityRole="button" accessibilityLabel="Open microphone">
            <Mic size={24} color={theme.colors.light.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.button} onPress={handleJournalSubmit} disabled={isLoading} accessibilityRole="button" accessibilityLabel="Reflect on journal">
            {isLoading ? (
               <Text style={styles.buttonText}>Thinking with you...</Text>
            ) : (
               <Text style={styles.buttonText}>Reflect</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: theme.spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ambientVisual: { alignItems: 'center', marginBottom: theme.spacing.lg },
  greetingText: { fontSize: theme.typography.sizes.title, color: theme.colors.light.text, textAlign: 'center', lineHeight: 34 },
  full: { flex: 1, padding: theme.spacing.lg, paddingBottom: 110 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.md },
  iconButton: { padding: theme.spacing.sm, marginRight: theme.spacing.sm },
  button: { backgroundColor: theme.colors.light.text, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.round },
  buttonText: { color: theme.colors.light.card, fontSize: 16, lineHeight: 24, padding: 12, fontWeight: '500' },
  errorText: { color: theme.colors.light.error, fontSize: 14, marginTop: 8, textAlign: 'center' },
  srOnly: { position: 'absolute', width: 1, height: 1, overflow: 'hidden' },
});
