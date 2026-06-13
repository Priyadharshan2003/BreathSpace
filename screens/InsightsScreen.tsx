import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../styles/theme';
import { CalmCard } from '../components/CalmCard';
import { useAppContext } from '../utils/AppContext';

export const InsightsScreen = () => {
  const { insight, suggestion } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollCenter} showsVerticalScrollIndicator={false}>
        {!insight ? (
          <Text style={styles.emptyText}>Write a journal entry to see what I notice...</Text>
        ) : (
          <>
            <CalmCard title="What I Notice">
              <Text style={styles.bodyText}>{insight}</Text>
            </CalmCard>
            {suggestion ? (
              <CalmCard title="A gentle idea">
                <Text style={styles.bodyText}>{suggestion}</Text>
              </CalmCard>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  scrollCenter: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg },
  bodyText: { fontSize: theme.typography.sizes.body, color: theme.colors.light.text, lineHeight: 26 },
  emptyText: { fontSize: theme.typography.sizes.body, color: theme.colors.light.textSecondary, textAlign: 'center' },
});
