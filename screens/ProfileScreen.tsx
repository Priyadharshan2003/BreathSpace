import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { supabase } from '../utils/supabase';
import { useAppContext } from '../utils/AppContext';

export const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsGuest } = useAppContext();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || 'Student');
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);
    try {
      await supabase.auth.signOut();
      setIsGuest(false);
    } catch (e) {
      console.error(e);
      setError("Failed to sign out. Try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={theme.colors.light.primary} />
        </View>
        <Text style={styles.emailText}>{userEmail}</Text>
        
        <View style={{ flex: 1 }} />
        
        {error && <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} disabled={isSigningOut} accessible={true} accessibilityRole="button" accessibilityLabel="Sign Out">
          {isSigningOut ? (
            <Text style={styles.signOutText}>Signing out...</Text>
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.light.primary} style={styles.icon} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  header: { padding: theme.spacing.xl, paddingBottom: theme.spacing.md },
  title: { fontSize: theme.typography.sizes.largeTitle, color: theme.colors.light.text, fontWeight: 'bold' },
  content: { flex: 1, padding: theme.spacing.xl, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.light.accent, justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.lg },
  emailText: { fontSize: theme.typography.sizes.title, color: theme.colors.light.text, fontWeight: '500' },
  signOutButton: { flexDirection: 'row', alignItems: 'center', borderColor: theme.colors.light.primary, borderWidth: 1, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.round, width: '100%', justifyContent: 'center', marginBottom: 100 },
  icon: { marginRight: theme.spacing.sm },
  signOutText: { color: theme.colors.light.primary, fontSize: theme.typography.sizes.body, fontWeight: '600' },
  errorText: { color: 'red', marginBottom: theme.spacing.md, textAlign: 'center' },
});
