import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../firebase/auth-context';

const WELCOME_KEY = 'hasSeenWelcome';

const hasSeenWelcome = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(WELCOME_KEY);
  return value === 'true';
};

export default function InitialNavigator() {
  const { user, initialLoading } = useAuth();
  const [initialRoute, setInitialRoute] = useState<string | undefined>();

  useEffect(() => {
    const checkWelcomeAndAuth = async () => {
      const seen = await hasSeenWelcome();
      if (!seen) {
        setInitialRoute('welcome-page');
      } else if (user) {
        setInitialRoute('(tabs)');
      } else {
        setInitialRoute('login');
      }
    };
    if (!initialLoading) {
      checkWelcomeAndAuth();
    }
  }, [user, initialLoading]);

  if (!initialRoute) {
    return null; // or a loading indicator
  }
   

  return (
    <Stack initialRouteName={initialRoute}>
        <Stack.Protected guard={initialRoute === 'welcome-page'}>
            <Stack.Screen name="welcome-page" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={initialRoute === 'login'}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="email-verification" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={initialRoute === '(tabs)'}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen name="not-found" />
    </Stack>
  );
}