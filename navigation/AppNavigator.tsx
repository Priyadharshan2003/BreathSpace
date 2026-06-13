import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { CompanionScreen } from '../screens/CompanionScreen';
import { ReflectScreen } from '../screens/ReflectScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
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
          } else if (route.name === 'Reflect') {
            iconName = 'moon-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.light.accent,
        tabBarInactiveTintColor: theme.colors.light.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: theme.spacing.lg,
          left: theme.spacing.lg,
          right: theme.spacing.lg,
          elevation: 0,
          backgroundColor: theme.colors.light.card,
          borderRadius: theme.borderRadius.lg,
          height: 70,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.sm,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.05,
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
      <Tab.Screen name="Reflect" component={ReflectScreen} />
    </Tab.Navigator>
  );
};
