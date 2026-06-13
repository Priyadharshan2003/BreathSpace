import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useLiveConvo } from '../hooks/useLiveConvo';

// ─────────────────────────────────────────────────────────────────────────────
// expo-camera is NOT imported here.
// It requires a native Dev Build and crashes Expo Go at bundle time.
// Camera UI is hidden until a Dev Build is used. See DEVBUILD.md.
// ─────────────────────────────────────────────────────────────────────────────

export const LiveScreen = ({ navigation }: any) => {
  const {
    state,
    transcript,
    setTranscript,
    aiResponse,
    startListening,
    stopListening,
    submitMessage,
  } = useLiveConvo();

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');

  const getOrbColor = () => {
    switch (state) {
      case 'LISTENING':    return '#3B82F6';
      case 'TRANSCRIBING': return '#F59E0B';
      case 'THINKING':     return '#8B5CF6';
      case 'SPEAKING':     return '#10B981';
      default:             return theme.colors.dark.border;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'IDLE':          return 'Tap mic to begin';
      case 'LISTENING':     return 'Listening...';
      case 'TRANSCRIBING':  return 'Understanding...';
      case 'AWAITING_USER': return 'Edit or Send';
      case 'THINKING':      return 'Thinking...';
      case 'SPEAKING':      return 'Speaking...';
      default:              return '';
    }
  };

  const handleMicPress = () => {
    if (state === 'IDLE' || state === 'AWAITING_USER') {
      startListening();
    } else if (state === 'LISTENING') {
      stopListening();
    }
  };

  const handleSend = () => {
    const text = transcript.trim();
    if (!text) return;
    submitMessage(text);
    setTranscript('');
  };

  const showTextInput =
    inputMode === 'text' || state === 'AWAITING_USER';

  const isBusy =
    state === 'TRANSCRIBING' || state === 'THINKING' || state === 'SPEAKING';

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Close live session"
        >
          <Ionicons name="close" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* ── Orb status indicator ── */}
        <View style={styles.orbContainer}>
          <View style={[styles.orb, { backgroundColor: getOrbColor() }]} />
          <Text style={styles.statusText} accessibilityRole="text">
            {getStatusText()}
          </Text>
          {Platform.OS !== 'web' && state === 'IDLE' && (
            <Text style={styles.hintText}>
              Voice recognition available on Web{'\n'}Use "Write instead" on mobile
            </Text>
          )}
        </View>

        {/* ── AI response ── */}
        <ScrollView
          style={styles.transcriptContainer}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        >
          {aiResponse ? (
            <Text style={styles.transcriptAi}>{aiResponse}</Text>
          ) : null}
        </ScrollView>

        {/* ── Input area ── */}
        <View style={styles.inputArea}>
          {showTextInput && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={transcript}
                onChangeText={setTranscript}
                placeholder="Type your message..."
                placeholderTextColor="#6B7280"
                multiline
                accessibilityLabel="Message input"
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
                accessibilityRole="button"
                accessibilityLabel="Send"
              >
                <Ionicons name="send" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* ── Mic / Stop / Busy button ── */}
          <View style={styles.controls}>
            {isBusy ? (
              <View style={[styles.mainButton, { backgroundColor: '#374151' }]}>
                <Ionicons name="ellipsis-horizontal" size={32} color="#9CA3AF" />
              </View>
            ) : state === 'LISTENING' ? (
              <TouchableOpacity
                style={[styles.mainButton, { backgroundColor: '#EF4444' }]}
                onPress={handleMicPress}
                accessibilityRole="button"
                accessibilityLabel="Stop listening"
              >
                <Ionicons name="stop-circle" size={36} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.mainButton, { backgroundColor: '#3B82F6' }]}
                onPress={handleMicPress}
                accessibilityRole="button"
                accessibilityLabel="Start listening"
              >
                <Ionicons name="mic" size={32} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* ── Mode switches ── */}
          <View style={styles.modeSwitches}>
            {inputMode === 'voice' ? (
              <TouchableOpacity
                onPress={() => {
                  setInputMode('text');
                  if (state === 'IDLE') {
                    // open input immediately
                  }
                }}
              >
                <Text style={styles.modeSwitchText}>✏️  Write instead</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setInputMode('voice')}>
                <Text style={styles.modeSwitchText}>🎤  Talk instead</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    zIndex: 10,
  },
  content: { flex: 1 },
  orbContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
  },
  hintText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  transcriptContainer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    maxHeight: 160,
  },
  transcriptAi: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    textAlign: 'center',
  },
  inputArea: {
    padding: 24,
    paddingBottom: 48,
    gap: 20,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 12,
    gap: 12,
  },
  textInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#10B981',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    alignItems: 'center',
  },
  mainButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeSwitches: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modeSwitchText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
});
