import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './utils/AppContext';
import { AppNavigator } from './navigation/AppNavigator';
import { AuthScreen } from './screens/AuthScreen';
import { SplashScreen } from './screens/SplashScreen';
import { View, StyleSheet } from 'react-native';
import { theme } from './styles/theme';
import { supabase } from './utils/supabase';
import { Session } from '@supabase/supabase-js';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={styles.container}>
          <NavigationContainer>
            {session || isGuest ? <AppNavigator /> : <AuthScreen onGuestLogin={() => setIsGuest(true)} />}
          </NavigationContainer>
          {isSplashVisible && (
            <SplashScreen onFinish={() => setIsSplashVisible(false)} />
          )}
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  }
});
