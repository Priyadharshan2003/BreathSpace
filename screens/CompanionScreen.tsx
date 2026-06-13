import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../styles/theme';
import { ChatBubble } from '../components/ChatBubble';
import { JournalInput } from '../components/JournalInput';
import { generateChatResponse, analyzeImageEntry } from '../services/aiService';
import { useAppContext } from '../utils/AppContext';

export const CompanionScreen = () => {
  const { chatHistory, setChatHistory, pastPatterns, ragContext } = useAppContext();
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const newHistory = [...chatHistory, { text: chatInput, isAI: false }];
    setChatHistory(newHistory);
    setChatInput('');
    setIsLoading(true);
    
    try {
      const context = chatHistory.map(m => `${m.isAI ? 'AI' : 'User'}: ${m.text}`).join('\n');
      const response = await generateChatResponse(chatInput, context, pastPatterns, ragContext);
      setChatHistory([...newHistory, { text: response, isAI: true }]);
    } catch (e) {
      setChatHistory([...newHistory, { text: "I'm here for you.", isAI: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].base64) {
      setIsLoading(true);
      const newHistory = [...chatHistory, { text: "[Sent an Image]", isAI: false }];
      setChatHistory(newHistory);

      try {
        const response = await analyzeImageEntry(result.assets[0].base64, result.assets[0].mimeType || 'image/jpeg');
        setChatHistory([...newHistory, { text: response, isAI: true }]);
      } catch (e) {
        setChatHistory([...newHistory, { text: "I see what you shared.", isAI: true }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.full}>
        <ScrollView style={styles.chatContainer}>
          {chatHistory.length === 0 ? (
            <Text style={styles.emptyText}>I'm here when you're ready to talk.</Text>
          ) : (
            chatHistory.map((msg, idx) => (
              <ChatBubble key={idx} text={msg.text} isAI={msg.isAI} />
            ))
          )}
        </ScrollView>
        <View style={styles.inputRow}>
          <JournalInput value={chatInput} onChangeText={setChatInput} placeholder="Type softly..." />
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconButton} onPress={handleImagePick}>
            <Ionicons name="camera-outline" size={24} color={theme.colors.light.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mic-outline" size={24} color={theme.colors.light.textSecondary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.button} onPress={handleChatSubmit} disabled={isLoading}>
            {isLoading ? (
               <ActivityIndicator size="small" color={theme.colors.light.card} />
            ) : (
               <Text style={styles.buttonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  full: { flex: 1, padding: theme.spacing.lg, paddingBottom: 110 },
  chatContainer: { flex: 1, marginBottom: theme.spacing.md },
  inputRow: { height: 100 },
  emptyText: { fontSize: theme.typography.sizes.body, color: theme.colors.light.textSecondary, textAlign: 'center', marginTop: theme.spacing.xl },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.xs },
  iconButton: { padding: theme.spacing.sm, marginRight: theme.spacing.sm },
  button: { backgroundColor: theme.colors.light.text, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.round },
  buttonText: { color: theme.colors.light.card, fontSize: theme.typography.sizes.body, fontWeight: '500' },
});
