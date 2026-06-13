import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useLiveConvo } from '../hooks/useLiveConvo';
import { CameraView, useCameraPermissions } from 'expo-camera';

export const LiveScreen = ({ navigation }: any) => {
  const { state, transcript, aiResponse, startListening, stopListening } = useLiveConvo();
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
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
      case 'THINKING': return '#8B5CF6'; // Purple
      case 'SPEAKING': return '#10B981'; // Green
      default: return theme.colors.dark.border;
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
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Exit Live Mode"
        >
          <Ionicons name="close" size={32} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={toggleVideo}
          accessibilityRole="button"
          accessibilityLabel={isVideoEnabled ? "Disable video feed" : "Enable video feed"}
        >
          <Ionicons name={isVideoEnabled ? "videocam" : "videocam-off"} size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.orbContainer}>
        <View style={[styles.orb, { backgroundColor: getOrbColor() }]} />
        <Text style={styles.statusText} accessibilityRole="text">
          {state === 'IDLE' ? 'Tap to start conversation' : state}
        </Text>
      </View>

      <View style={styles.transcriptContainer} accessibilityRole="text">
        {transcript ? <Text style={styles.transcriptUser}>"{transcript}"</Text> : null}
        {aiResponse ? <Text style={styles.transcriptAi}>{aiResponse}</Text> : null}
      </View>

      <View style={styles.controls}>
        {state === 'IDLE' ? (
          <TouchableOpacity 
            style={[styles.mainButton, { backgroundColor: '#3B82F6' }]} 
            onPress={startListening}
            accessibilityRole="button"
            accessibilityLabel="Start talking to AI"
          >
            <Ionicons name="mic" size={32} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.mainButton, { backgroundColor: '#EF4444' }]} 
            onPress={stopListening}
            accessibilityRole="button"
            accessibilityLabel="Stop talking to AI"
          >
            <Ionicons name="stop" size={32} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, zIndex: 10 },
  orbContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orb: { width: 150, height: 150, borderRadius: 75, shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 50 },
  statusText: { color: '#FFF', marginTop: 24, fontSize: 18, fontWeight: '600', letterSpacing: 2 },
  transcriptContainer: { padding: 32, minHeight: 200, justifyContent: 'flex-end' },
  transcriptUser: { color: '#9CA3AF', fontSize: 18, marginBottom: 12, fontStyle: 'italic' },
  transcriptAi: { color: '#FFF', fontSize: 22, fontWeight: '500', lineHeight: 32 },
  controls: { paddingBottom: 60, alignItems: 'center' },
  mainButton: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }
});
