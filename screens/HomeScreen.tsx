import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { JournalInput } from '../components/JournalInput';
import { analyzeEmotion, generateInsight, getSuggestion } from '../services/aiService';
import { saveEmotionalTag } from '../services/supabaseService';
import { useAppContext } from '../utils/AppContext';
import { supabase } from '../utils/supabase';

export const HomeScreen = ({ navigation }: any) => {
  const { journalText, setJournalText, setInsight, setSuggestion, setChatHistory, pastPatterns, ragContext } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const handleJournalSubmit = async () => {
    if (!journalText.trim()) return;
    setIsLoading(true);
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
      setInsight("It seems you have a lot on your mind...");
      navigation.navigate('Insights');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="leaf" size={40} color={theme.colors.light.primary} accessibilityLabel="BreathSpace Logo" />
        <TouchableOpacity onPress={logout} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Log out">
          <Ionicons name="log-out-outline" size={28} color={theme.colors.light.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.full}>
        <JournalInput value={journalText} onChangeText={setJournalText} />
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Live')} accessibilityRole="button" accessibilityLabel="Start live session">
            <Ionicons name="radio-outline" size={24} color={theme.colors.light.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Live')} accessibilityRole="button" accessibilityLabel="Open camera">
            <Ionicons name="camera-outline" size={24} color={theme.colors.light.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Live')} accessibilityRole="button" accessibilityLabel="Open microphone">
            <Ionicons name="mic-outline" size={24} color={theme.colors.light.textSecondary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.button} onPress={handleJournalSubmit} disabled={isLoading} accessibilityRole="button" accessibilityLabel="Reflect on journal">
            {isLoading ? (
               <ActivityIndicator size="small" color={theme.colors.light.card} />
            ) : (
               <Text style={styles.buttonText}>Reflect</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  header: { padding: theme.spacing.xl, alignItems: 'center' },
  greetingText: { fontSize: theme.typography.sizes.title, color: theme.colors.light.text, textAlign: 'center', lineHeight: 34 },
  full: { flex: 1, padding: theme.spacing.lg, paddingBottom: 110 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.md },
  iconButton: { padding: theme.spacing.sm, marginRight: theme.spacing.sm },
  button: { backgroundColor: theme.colors.light.text, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.round },
  buttonText: { color: theme.colors.light.card, fontSize: theme.typography.sizes.body, fontWeight: '500' },
});
