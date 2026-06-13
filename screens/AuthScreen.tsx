import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { User } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { theme } from '../styles/theme';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { supabase } from '../utils/supabase';

WebBrowser.maybeCompleteAuthSession();

export const AuthScreen = ({ onGuestLogin }: { onGuestLogin?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const redirectUrl = Linking.createURL('/');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      if (data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      }
    } catch (e) {
      console.error("Auth error: ", e);
      setError("Failed to start Google Sign In. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        
        <Text style={styles.title}>BreathSpace</Text>
        <Text style={styles.subtitle}>Your safe space to reflect.</Text>
        
        {error && <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn} disabled={isLoading} accessible={true} accessibilityRole="button" accessibilityLabel="Continue with Google">
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.light.card} />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color={theme.colors.light.card} style={styles.icon} />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {onGuestLogin && (
          <TouchableOpacity style={[styles.button, styles.guestButton]} onPress={onGuestLogin} disabled={isLoading} accessible={true} accessibilityRole="button" accessibilityLabel="Continue as Guest">
            <User size={20} color={theme.colors.light.primary} strokeWidth={1.5} style={styles.icon} />
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        )}
      </View>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
  logo: { width: 120, height: 120, borderRadius: 60, marginBottom: theme.spacing.lg },
  title: { fontSize: theme.typography.sizes.largeTitle, color: theme.colors.light.text, fontFamily: theme.typography.fontFamily, marginBottom: theme.spacing.sm, fontWeight: 'bold' },
  subtitle: { fontSize: theme.typography.sizes.body, color: theme.colors.light.textSecondary, marginBottom: theme.spacing.xxl },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.light.primary, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.round, width: '100%', justifyContent: 'center' },
  icon: { marginRight: theme.spacing.sm },
  buttonText: { color: theme.colors.light.card, fontSize: theme.typography.sizes.body, fontWeight: '600' },
  guestButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.light.primary, marginTop: theme.spacing.md },
  guestButtonText: { color: theme.colors.light.primary, fontSize: theme.typography.sizes.body, fontWeight: '600' },
  errorText: { color: 'red', marginBottom: theme.spacing.md, textAlign: 'center' },
});
