import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace("/auth/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [isAuthenticated, segments]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // TODO: Replace with actual auth state
  const isAuthenticated = false;

  useProtectedRoute(isAuthenticated);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}