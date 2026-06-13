import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { theme } from '../styles/theme';

interface JournalInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  "Write anything... no pressure.",
  "What's on your mind?",
  "Take a deep breath and start typing..."
];

export const JournalInput: React.FC<JournalInputProps> = ({ 
  value, 
  onChangeText, 
  placeholder,
  suggestions = DEFAULT_SUGGESTIONS
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (placeholder) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % suggestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholder, suggestions.length]);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <TextInput
        style={styles.input}
        multiline
        placeholder={placeholder || suggestions[currentIdx]}
        placeholderTextColor={theme.colors.light.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
        accessible={true}
        accessibilityLabel={placeholder || "Journal input field"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.sm,
  },
  containerFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: theme.colors.light.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 2,
  },
  input: {
    fontSize: theme.typography.sizes.title,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.light.text,
    lineHeight: theme.typography.lineHeights.body * 1.2,
    textAlignVertical: 'top', // For Android
    paddingTop: theme.spacing.sm, // Forces top alignment on iOS/Web
    ...( { outlineStyle: 'none' } as any ), // Removes web blue border
  },
});
