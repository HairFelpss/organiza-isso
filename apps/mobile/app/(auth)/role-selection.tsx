import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "expo-router";
import { ArrowRight, Briefcase, ChevronLeft, User } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function RoleSelectionScreen() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];
  const router = useRouter();

  const handleRoleSelect = (role: "client" | "professional") => {
    // For MVP, we'll navigate directly to tabs
    router.replace("/(tabs)");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <Animated.View
        entering={FadeIn.duration(600).delay(100)}
        style={styles.header}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Como deseja usar o app?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Escolha o seu perfil principal
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(600).delay(200)}
        style={styles.roleCards}
      >
        <TouchableOpacity
          style={[
            styles.roleCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => handleRoleSelect("client")}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <User size={24} color={colors.primary} />
          </View>
          <Text style={[styles.roleTitle, { color: colors.text }]}>
            Cliente
          </Text>
          <Text style={[styles.roleDesc, { color: colors.textSecondary }]}>
            Quero agendar serviços com profissionais
          </Text>
          <View style={styles.arrowContainer}>
            <ArrowRight size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => handleRoleSelect("professional")}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Briefcase size={24} color={colors.primary} />
          </View>
          <Text style={[styles.roleTitle, { color: colors.text }]}>
            Profissional
          </Text>
          <Text style={[styles.roleDesc, { color: colors.textSecondary }]}>
            Quero oferecer meus serviços para agendamento
          </Text>
          <View style={styles.arrowContainer}>
            <ArrowRight size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.Text
        entering={FadeIn.duration(600).delay(300)}
        style={[styles.note, { color: colors.textTertiary }]}
      >
        Você poderá alterar seu perfil posteriormente nas configurações
      </Animated.Text>
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
  roleCards: {
    gap: 16,
    marginBottom: 24,
  },
  roleCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    position: "relative",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  roleDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginRight: 20,
  },
  arrowContainer: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  note: {
    textAlign: "center",
    fontSize: 14,
  },
});
