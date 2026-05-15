import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '../screens/auth/SplashScreen';
import RoleSelectionScreen from '../screens/profile/RoleSelectionScreen';
import { useAuthStore } from '../store/useAuthStore';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  // Bypass login for now as per user request
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="App" component={AppNavigator} />
    </Stack.Navigator>
  );
}
