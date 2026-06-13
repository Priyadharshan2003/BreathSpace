import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface ChatBubbleProps {
  text: string;
  isAI?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isAI = false }) => {
  return (
    <View style={[
      styles.bubbleContainer,
      isAI ? styles.aiContainer : styles.userContainer
    ]}>
      <Text style={[
        styles.text,
        isAI ? styles.aiText : styles.userText
      ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.xs,
  },
  aiContainer: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.light.card,
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.light.accent,
    borderTopRightRadius: 4,
  },
  text: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    lineHeight: theme.typography.lineHeights.body,
  },
  aiText: {
    color: theme.colors.light.text,
  },
  userText: {
    color: theme.colors.light.text,
  },
});
