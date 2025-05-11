import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { Link, useRouter } from "expo-router";
import { ArrowRight, ChevronLeft, Lock, Mail, User } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
export default function SignupScreen() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];
  const router = useRouter();

  const handleSignup = () => {
    // For MVP, we'll navigate directly without validation
    router.push("/(auth)/role-selection");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <Animated.View
        entering={FadeIn.duration(600).delay(100)}
        style={styles.header}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Criar uma conta
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Preencha os campos abaixo para se cadastrar
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(600).delay(200)}
        style={styles.form}
      >
        <View style={styles.inputContainer}>
          <User size={20} color={colors.icon} style={styles.inputIcon} />
          <TextInput
            placeholder="Nome completo"
            placeholderTextColor={colors.inputPlaceholder}
            style={[
              styles.input,
              {
                backgroundColor: colors.input,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Lock size={20} color={colors.icon} style={styles.inputIcon} />
          <TextInput
            placeholder="Confirmar senha"
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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
          onPress={handleSignup}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Continuar
          </Text>
          <ArrowRight size={20} color={colors.buttonText} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(600).delay(300)}
        style={styles.footer}
      >
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Já tem uma conta?{" "}
        </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              Entrar
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
  },
  backButton: {
    marginTop: 40,
    marginBottom: 16,
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
  button: {
    flexDirection: "row",
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
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
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
