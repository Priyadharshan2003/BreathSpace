import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { theme } from '../styles/theme';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message }) => {
  return (
    <View style={styles.container}>
      <Icon size={48} color={theme.colors.light.textSecondary} strokeWidth={1.5} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    minHeight: 200,
  },
  icon: {
    marginBottom: theme.spacing.md,
    opacity: 0.7,
  },
  message: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.body,
    fontFamily: theme.typography.fontFamily,
  },
});
