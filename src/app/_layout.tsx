import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { auth } from '../../firebaseConfig';
import { CartProvider } from '@/context/cart-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified || user.phoneNumber) {
          router.replace('/(tabs)');
        } else {
          router.replace('/verify-email');
        }
      } else {
        router.replace('/welcome');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <CartProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="phone-login" />
          <Stack.Screen name="verify-email" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </CartProvider>
  );
}