import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

interface BackgroundGradientProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean; // You can toggle this based on a global theme provider if you add one
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ children, style, isDark = false }) => {
  const colors = (isDark 
    ? [theme.colors.dark.background, '#1A1B41'] // Navy to dark purple-ish fade
    : [theme.colors.light.card, '#E6F4FE']) as readonly [string, string, ...string[]];

  return (
    <LinearGradient
      colors={colors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
