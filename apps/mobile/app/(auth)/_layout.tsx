import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background as string,
        },
        headerTintColor: colors.text as string,
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Entrar",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Criar conta",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="role-selection"
        options={{
          title: "Selecionar perfil",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
