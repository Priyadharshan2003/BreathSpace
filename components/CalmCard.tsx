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
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, // For Android
  },
  title: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.light.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
});
