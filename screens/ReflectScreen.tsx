import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { BackgroundGradient } from '../components/BackgroundGradient';

export const ReflectScreen = () => {
  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Moon size={60} color={theme.colors.light.primary} strokeWidth={1} style={{ marginBottom: theme.spacing.xl, opacity: 0.8 }} />
          <Text style={styles.greetingText}>You did enough today.</Text>
          <Text style={styles.greetingText}>Rest.</Text>
        </View>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  greetingText: { 
    fontSize: theme.typography.sizes.title, 
    color: theme.colors.light.text, 
    textAlign: 'center', 
    lineHeight: 34 
  },
});
