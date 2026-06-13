import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { CompanionScreen } from '../screens/CompanionScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LiveScreen } from '../screens/LiveScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home-outline';

          if (route.name === 'Home') {
            iconName = 'leaf-outline';
          } else if (route.name === 'Insights') {
            iconName = 'bulb-outline';
          } else if (route.name === 'Companion') {
            iconName = 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.light.primary,
        tabBarInactiveTintColor: theme.colors.light.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: theme.spacing.lg,
          left: theme.spacing.lg,
          right: theme.spacing.lg,
          elevation: 10,
          backgroundColor: theme.colors.light.card,
          borderRadius: theme.borderRadius.lg,
          height: 70,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.sm,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: 12,
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Companion" component={CompanionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Live" component={LiveScreen} />
    </Stack.Navigator>
  );
};
