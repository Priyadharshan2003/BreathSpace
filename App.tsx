import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './utils/AppContext';
import { AppNavigator } from './navigation/AppNavigator';
import { SplashScreen } from './screens/SplashScreen';
import { View, StyleSheet } from 'react-native';
import { theme } from './styles/theme';

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <AppProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        {isSplashVisible && (
          <SplashScreen onFinish={() => setIsSplashVisible(false)} />
        )}
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  }
});
