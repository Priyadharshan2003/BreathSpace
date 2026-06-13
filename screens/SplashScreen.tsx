import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Breathing animation (expand and contract slowly)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade out after 4 seconds
    const timer = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <SafeAreaView style={styles.center}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />
        <Text style={styles.splashText}>BreathSpace</Text>
        <Text style={styles.subText}>Take a breath.</Text>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { 
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: theme.colors.light.background, 
    zIndex: 999 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.light.accent,
    marginBottom: theme.spacing.xl,
    opacity: 0.5,
  },
  splashText: { 
    fontSize: theme.typography.sizes.largeTitle, 
    fontFamily: theme.typography.fontFamily, 
    color: theme.colors.light.text, 
    marginBottom: theme.spacing.md 
  },
  subText: { 
    fontSize: theme.typography.sizes.body, 
    color: theme.colors.light.textSecondary 
  },
});
