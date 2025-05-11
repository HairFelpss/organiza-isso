```tsx
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Link, router } from "expo-router";
import { Button } from "@organiza-isso-app/ui/button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = () => {
    // TODO: Implement registration logic
    router.replace("/(tabs)");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Create Account
        </ThemedText>

        <View style={styles.form}>
          <ThemedTextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => updateField("name", value)}
          />

          <ThemedTextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ThemedTextInput
            label="Phone"
            value={formData.phone}
            onChangeText={(value) => updateField("phone", value)}
            keyboardType="phone-pad"
          />

          <ThemedTextInput
            label="Document (CPF/CNPJ)"
            value={formData.document}
            onChangeText={(value) => updateField("document", value)}
            keyboardType="numeric"
          />

          <ThemedTextInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateField("password", value)}
            secureTextEntry
          />

          <ThemedTextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField("confirmPassword", value)}
            secureTextEntry
          />

          <Button variant="primary" size="lg" onPress={handleRegister}>
            Create Account
          </Button>
        </View>

        <View style={styles.footer}>
          <ThemedText>Already have an account? </ThemedText>
          <Link href="/auth/login" asChild>
            <ThemedText type="link">Sign in</ThemedText>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "var(--color-background)",
  },
  scrollContent: {
    flexGrow: 1,
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
});
```;
