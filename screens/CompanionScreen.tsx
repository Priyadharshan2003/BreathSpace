import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Radio, Camera, Mic, MessageCircleHeart } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../styles/theme';
import { ChatBubble } from '../components/ChatBubble';
import { JournalInput } from '../components/JournalInput';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { EmptyState } from '../components/EmptyState';
import { generateChatResponse, analyzeImageEntry } from '../services/aiService';
import { useAppContext } from '../utils/AppContext';

export const CompanionScreen = ({ navigation }: any) => {
  const { chatHistory, setChatHistory, pastPatterns, ragContext } = useAppContext();
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChatSubmit = async () => {
    if (!chatInput || chatInput.trim() === "") {
      setError("You can take your time… write whenever you're ready.");
      return;
    }
    const newHistory = [...chatHistory, { text: chatInput, isAI: false }];
    setChatHistory(newHistory);
    setChatInput('');
    setIsLoading(true);
    
    try {
      setError(null);
      const context = chatHistory.map(m => `${m.isAI ? 'AI' : 'User'}: ${m.text}`).join('\n');
      const response = await generateChatResponse(chatInput, context, pastPatterns, ragContext);
      setChatHistory([...newHistory, { text: response, isAI: true }]);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      base64: true,
      quality: 0.5,
    });

    if (result.canceled) {
      setError("It's okay, you can share a photo whenever you're ready.");
      return;
    }

    if (result.assets && result.assets[0] && result.assets[0].base64) {
      setIsLoading(true);
      const newHistory = [...chatHistory, { text: "[Sent an Image]", isAI: false }];
      setChatHistory(newHistory);

      try {
        setError(null);
        const response = await analyzeImageEntry(result.assets[0].base64, result.assets[0].mimeType || 'image/jpeg');
        setChatHistory([...newHistory, { text: response, isAI: true }]);
      } catch (e) {
        console.error(e);
        setError("Something went wrong with the image. Try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greetingText}>Companion</Text>
        </View>
      <View style={styles.full}>
        <ScrollView style={styles.chatContainer}>
          {chatHistory.length === 0 ? (
            <EmptyState icon={MessageCircleHeart} message="I'm here when you're ready to talk." />
          ) : (
            chatHistory.map((msg, idx) => (
              <ChatBubble key={idx} text={msg.text} isAI={msg.isAI} />
            ))
          )}
        </ScrollView>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>
          </View>
        )}
        <View style={styles.inputRow}>
          <JournalInput value={chatInput} onChangeText={setChatInput} placeholder="Type softly..." />
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Live')} accessibilityRole="button" accessibilityLabel="Start live session">
            <Radio size={24} color={theme.colors.light.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Open camera" onPress={handleImagePick}>
            <Camera size={24} color={theme.colors.light.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Live')} accessibilityRole="button" accessibilityLabel="Voice input">
            <Mic size={24} color={theme.colors.light.textSecondary} strokeWidth={1.5} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.button} onPress={handleChatSubmit} disabled={isLoading} accessibilityRole="button" accessibilityLabel="Send message">
            {isLoading ? (
               <Text style={styles.buttonText}>Thinking with you...</Text>
            ) : (
               <Text style={styles.buttonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: theme.spacing.xl, alignItems: 'center' },
  greetingText: { fontSize: theme.typography.sizes.title, color: theme.colors.light.text, textAlign: 'center', lineHeight: 34 },
  full: { flex: 1, padding: theme.spacing.lg, paddingBottom: 110 },
  chatContainer: { flex: 1, marginBottom: theme.spacing.md },
  inputRow: { height: 100 },
  emptyText: { fontSize: theme.typography.sizes.body, color: theme.colors.light.textSecondary, textAlign: 'center', marginTop: theme.spacing.xl },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.xs },
  iconButton: { padding: theme.spacing.sm, marginRight: theme.spacing.sm },
  button: { backgroundColor: theme.colors.light.text, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.round },
  buttonText: { color: theme.colors.light.card, fontSize: theme.typography.sizes.body, fontWeight: '500' },
  errorContainer: { padding: theme.spacing.sm, backgroundColor: 'rgba(255, 0, 0, 0.1)', borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.sm },
  errorText: { color: 'red', textAlign: 'center', fontSize: theme.typography.sizes.body },
});
