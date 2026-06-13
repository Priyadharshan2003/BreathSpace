import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { theme } from '../styles/theme';

interface JournalInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const JournalInput: React.FC<JournalInputProps> = ({ 
  value, 
  onChangeText, 
  placeholder = "Write anything on your mind..." 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder={placeholder}
        placeholderTextColor={theme.colors.light.textSecondary}
        value={value}
        onChangeText={onChangeText}
        autoFocus
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.light.background,
  },
  input: {
    fontSize: theme.typography.sizes.title,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.light.text,
    lineHeight: theme.typography.lineHeights.body * 1.2,
    textAlignVertical: 'top', // For Android
  },
});
