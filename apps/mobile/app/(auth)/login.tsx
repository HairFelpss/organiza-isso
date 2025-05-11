```tsx
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Link, router } from "expo-router";
import { Button } from "@organiza-isso-app/ui/button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Implement login logic
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome Back
        </ThemedText>

        <View style={styles.form}>
          <ThemedTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ThemedTextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Link href="/auth/forgot-password" asChild>
            <ThemedText type="link" style={styles.forgotPassword}>
              Forgot password?
            </ThemedText>
          </Link>

          <Button variant="primary" size="lg" onPress={handleLogin}>
            Sign In
          </Button>
        </View>

        <View style={styles.footer}>
          <ThemedText>Don't have an account? </ThemedText>
          <Link href="/auth/register" asChild>
            <ThemedText type="link">Sign up</ThemedText>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "var(--color-background)",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  forgotPassword: {
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
});
```