import { useAuth } from "@/contexts/auth-context";
import { Redirect, Stack } from "expo-router";

export default function MainLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack />;
}
