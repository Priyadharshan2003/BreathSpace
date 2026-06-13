import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { Bot } from 'lucide-react-native';

interface ChatBubbleProps {
  text: string;
  isAI?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isAI = false }) => {
  return (
    <View style={[
      styles.wrapper,
      isAI ? styles.aiWrapper : styles.userWrapper
    ]}>
      {isAI && (
        <View style={styles.avatarContainer}>
          <Bot size={16} color={theme.colors.light.primary} />
        </View>
      )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: theme.spacing.xs,
    alignItems: 'flex-end',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    shadowColor: theme.colors.light.primary,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  bubbleContainer: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  aiContainer: {
    backgroundColor: theme.colors.light.card,
    borderBottomLeftRadius: 4,
    shadowColor: theme.colors.light.primary,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  userContainer: {
    backgroundColor: theme.colors.light.accent,
    borderBottomRightRadius: 4,
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
    color: theme.colors.light.primary,
    fontWeight: '500',
  },
});
