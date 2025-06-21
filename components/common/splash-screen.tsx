import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {

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
}
