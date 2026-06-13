import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lightbulb } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { CalmCard } from '../components/CalmCard';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { EmptyState } from '../components/EmptyState';
import { useAppContext } from '../utils/AppContext';

export const InsightsScreen = () => {
  const { insight, suggestion } = useAppContext();

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollCenter} showsVerticalScrollIndicator={false}>
          {!insight ? (
            <EmptyState icon={Lightbulb} message="Write a journal entry to see what I notice..." />
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
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollCenter: { flexGrow: 1, justifyContent: 'center', alignItems: 'stretch', padding: theme.spacing.lg },
  bodyText: { fontSize: theme.typography.sizes.body, color: theme.colors.light.text, lineHeight: 26 },
  emptyText: { fontSize: theme.typography.sizes.body, color: theme.colors.light.textSecondary, textAlign: 'center' },
});
