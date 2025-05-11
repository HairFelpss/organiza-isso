import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

// Create a separate component for the content that needs theme access
function AppContent() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <Slot />;
}

// Create a separate component for StatusBar
function ThemedStatusBar() {
  const { actualTheme } = useTheme();
  return <StatusBar style={actualTheme === "dark" ? "light" : "dark"} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
        <ThemedStatusBar />
      </ThemeProvider>
    </AuthProvider>
  );
}
