import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { Button } from "@organiza-isso-app/ui/button";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement password reset logic
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Check Your Email
          </ThemedText>

          <ThemedText style={styles.message}>
            Weve sent password reset instructions to {email}
          </ThemedText>

          <Link href="/(auth)/login" asChild>
            <Button variant="secondary" size="lg">
              Return to Login
            </Button>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Reset Password
        </ThemedText>

        <ThemedText style={styles.message}>
          Enter your email address and well send you instructions to reset your
          password.
        </ThemedText>

        <View style={styles.form}>
          <ThemedTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button variant="primary" size="lg" onPress={handleSubmit}>
            Send Reset Instructions
          </Button>
        </View>

        <Link href="/(auth)/login" asChild>
          <ThemedText type="link" style={styles.backLink}>
            Back to Login
          </ThemedText>
        </Link>
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
    marginBottom: 16,
  },
  message: {
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  backLink: {
    textAlign: "center",
    marginTop: 24,
  },
});
