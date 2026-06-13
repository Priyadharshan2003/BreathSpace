import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface CalmCardProps {
  title?: string;
  children: React.ReactNode;
}

export const CalmCard: React.FC<CalmCardProps> = ({ title, children }) => {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.borderRadius.lg, // now 16px from theme
    padding: theme.spacing.lg, // 24px padding (>= 12px requested)
    marginVertical: theme.spacing.sm,
    shadowColor: theme.colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3, // For Android
  },
  title: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.light.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
});
