import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { Link, useRouter } from "expo-router";
import { ArrowRight, Lock, Mail } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function LoginScreen() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];
  const router = useRouter();

  const handleLogin = () => {
    // For MVP, we'll navigate directly without validation
    router.replace("/(tabs)");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View
        entering={FadeIn.duration(600).delay(100)}
        style={styles.header}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Bem-vindo de volta
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Entre para acessar sua agenda e compromissos
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(600).delay(200)}
        style={styles.form}
      >
        <View style={styles.inputContainer}>
          <Mail size={20} color={colors.icon} style={styles.inputIcon} />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor={colors.inputPlaceholder}
            style={[
              styles.input,
              {
                backgroundColor: colors.input,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color={colors.icon} style={styles.inputIcon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={colors.inputPlaceholder}
            style={[
              styles.input,
              {
                backgroundColor: colors.input,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            secureTextEntry
          />
        </View>

        <TouchableOpacity>
          <Text style={[styles.forgotPassword, { color: colors.primary }]}>
            Esqueceu sua senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Entrar
          </Text>
          <ArrowRight size={20} color={colors.buttonText} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(600).delay(300)}
        style={styles.footer}
      >
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Não tem uma conta?{" "}
        </Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text style={[styles.signupLink, { color: colors.primary }]}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 48,
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: "right",
    marginBottom: 24,
    fontSize: 14,
  },
  button: {
    flexDirection: "row",
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
