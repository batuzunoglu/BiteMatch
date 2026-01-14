import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import "../global.css";

SplashScreen.preventAutoHideAsync();

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSync } from '../hooks/useSync';
import { useAuth } from '../hooks/useAuth';

import { useAppStore } from '../hooks/useAppStore';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
    const [loaded, error] = useFonts({
        'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
        'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
        'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
        'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
        'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    });

    const { user } = useAuth();
    useSync();
    const hasCompletedOnboarding = useAppStore(state => state.hasCompletedOnboarding);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    useEffect(() => {
        if (!loaded) return;

        const inTabsGroup = segments[0] === '(tabs)';
        const onWelcomeScreen = segments[0] === 'welcome';

        if (!hasCompletedOnboarding && !onWelcomeScreen) {
            // Force onboarding if not complete
            router.replace('/welcome');
        } else if (hasCompletedOnboarding && onWelcomeScreen) {
            // Don't allow welcome screen if onboarding is complete
            router.replace('/(tabs)');
        }
    }, [hasCompletedOnboarding, segments, loaded]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="welcome" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
                <Toast />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
