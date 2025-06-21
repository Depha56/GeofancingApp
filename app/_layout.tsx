import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import "@/scripts/global.css";

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/firebase/auth-context';
import { TrackingProvider } from '../firebase/tracking-context';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
            SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    });
    
    useEffect(() => {
        if (loaded ) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <TrackingProvider>
                <AuthProvider>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="login" options={{ headerShown: false }} />
                        <Stack.Screen name="signup" options={{ headerShown: false }} />
                        <Stack.Screen name="email-verification" options={{ headerShown: false }} />
                        <Stack.Screen name="not-found" />
                    </Stack>
                    <StatusBar barStyle="light-content" backgroundColor="#041a3a" />
                </AuthProvider>
            </TrackingProvider>
        </ThemeProvider>
    );
}
