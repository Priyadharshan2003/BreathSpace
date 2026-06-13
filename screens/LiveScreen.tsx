import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useLiveConvo } from '../hooks/useLiveConvo';
import { CameraView, useCameraPermissions } from 'expo-camera';

export const LiveScreen = ({ navigation }: any) => {
  const { state, transcript, setTranscript, aiResponse, startListening, stopListening, submitMessage } = useLiveConvo();
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [permission, requestPermission] = useCameraPermissions();

  const toggleVideo = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  const getOrbColor = () => {
    switch (state) {
      case 'LISTENING': return '#3B82F6'; // Blue
      case 'TRANSCRIBING': return '#F59E0B'; // Yellow/Orange
      case 'THINKING': return '#8B5CF6'; // Purple
      case 'SPEAKING': return '#10B981'; // Green
      default: return theme.colors.dark.border;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'IDLE': return 'Ready to listen';
      case 'LISTENING': return 'Listening...';
      case 'TRANSCRIBING': return 'Understanding...';
      case 'AWAITING_USER': return 'Edit or Send';
      case 'THINKING': return 'Thinking...';
      case 'SPEAKING': return 'Speaking...';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isVideoEnabled && permission?.granted && (
        <View style={StyleSheet.absoluteFill}>
          <CameraView style={StyleSheet.absoluteFill} facing="front" />
          <View style={styles.cameraOverlay} />
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
          <Ionicons name="close" size={32} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleVideo} accessibilityRole="button">
          <Ionicons name={isVideoEnabled ? "videocam" : "videocam-off"} size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.orbContainer}>
          <View style={[styles.orb, { backgroundColor: getOrbColor() }]} />
          <Text style={styles.statusText} accessibilityRole="text">
            {getStatusText()}
          </Text>
        </View>

        <ScrollView style={styles.transcriptContainer} contentContainerStyle={{ justifyContent: 'flex-end', flexGrow: 1 }}>
          {aiResponse ? <Text style={styles.transcriptAi}>{aiResponse}</Text> : null}
        </ScrollView>

        <View style={styles.inputArea}>
          {state === 'AWAITING_USER' || inputMode === 'text' ? (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={transcript}
                onChangeText={setTranscript}
                placeholder="Type or edit your message..."
                placeholderTextColor="#6B7280"
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={() => {
                 submitMessage(transcript);
                 setTranscript('');
              }}>
                <Ionicons name="send" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.controls}>
            {state === 'IDLE' || state === 'AWAITING_USER' ? (
              <TouchableOpacity 
                style={[styles.mainButton, { backgroundColor: '#3B82F6' }]} 
                onPress={startListening}
              >
                <Ionicons name="mic" size={32} color="#FFF" />
              </TouchableOpacity>
            ) : state === 'LISTENING' ? (
              <TouchableOpacity 
                style={[styles.mainButton, { backgroundColor: '#EF4444' }]} 
                onPress={stopListening}
              >
                <Ionicons name="stop" size={32} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <View style={[styles.mainButton, { backgroundColor: '#374151' }]}>
                <Ionicons name="ellipsis-horizontal" size={32} color="#FFF" />
              </View>
            )}
          </View>
          
          <View style={styles.modeSwitches}>
            {inputMode === 'voice' ? (
              <TouchableOpacity onPress={() => setInputMode('text')}>
                <Text style={styles.modeSwitchText}>Write instead</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setInputMode('voice')}>
                <Text style={styles.modeSwitchText}>Talk instead</Text>
              </TouchableOpacity>
            )}
            {!isVideoEnabled && (
              <TouchableOpacity onPress={toggleVideo}>
                <Text style={styles.modeSwitchText}>Capture instead</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, zIndex: 10 },
  content: { flex: 1 },
  orbContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orb: { width: 120, height: 120, borderRadius: 60, shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 40 },
  statusText: { color: '#FFF', marginTop: 24, fontSize: 16, fontWeight: '500', letterSpacing: 1 },
  transcriptContainer: { paddingHorizontal: 24, paddingBottom: 12, maxHeight: '40%' },
  transcriptAi: { color: '#FFF', fontSize: 20, fontWeight: '500', lineHeight: 30, textAlign: 'center' },
  inputArea: { padding: 24, paddingBottom: 40 },
  textInputContainer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#1F2937', borderRadius: 20, padding: 12, marginBottom: 24 },
  textInput: { flex: 1, color: '#FFF', fontSize: 16, minHeight: 40, maxHeight: 120 },
  sendButton: { marginLeft: 12, backgroundColor: '#10B981', padding: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  controls: { alignItems: 'center', marginBottom: 24 },
  mainButton: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  modeSwitches: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  modeSwitchText: { color: '#9CA3AF', fontSize: 14, fontWeight: '500' }
});
