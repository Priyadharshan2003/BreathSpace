import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

export const ReflectScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.greetingText}>You did enough today.</Text>
        <Text style={styles.greetingText}>Rest.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  greetingText: { 
    fontSize: theme.typography.sizes.title, 
    color: theme.colors.light.text, 
    textAlign: 'center', 
    lineHeight: 34 
  },
});
