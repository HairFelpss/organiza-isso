import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { SearchBar } from "@/components/common/SearchBar";
import { HomeHeader } from "@/components/home/HomeHeader";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "expo-router";
import { Calendar, ChevronRight } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";

export default function HomeScreen() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HomeHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={FadeIn.duration(600)}
          style={styles.searchSection}
        >
          <SearchBar placeholder="Buscar serviços, profissionais..." />
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(600).delay(100)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Próximos agendamentos
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                Ver todos
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.appointmentsContainer}>
            <AppointmentCard
              title="Consulta Médica"
              provider="Dra. Ana Silva"
              dateTime="Hoje, 14:30"
              status="confirmed"
            />
            <AppointmentCard
              title="Corte de Cabelo"
              provider="Barbearia Central"
              dateTime="Amanhã, 10:00"
              status="pending"
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(600).delay(200)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Categorias
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInRight.duration(400).delay(100 * index)}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    {category.icon(colors.primary as string)}
                  </View>
                  <Text style={[styles.categoryName, { color: colors.text }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(600).delay(300)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Profissionais populares
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                Ver todos
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providersContainer}
          >
            {providers.map((provider, index) => (
              <Animated.View
                key={provider.id}
                entering={FadeInRight.duration(400).delay(100 * index)}
              >
                <TouchableOpacity
                  style={[
                    styles.providerCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.providerImagePlaceholder}>
                    <Text style={{ color: colors.background }}>
                      {provider.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={[styles.providerName, { color: colors.text }]}>
                    {provider.name}
                  </Text>
                  <Text
                    style={[
                      styles.providerSpecialty,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {provider.specialty}
                  </Text>
                  <View
                    style={[
                      styles.ratingContainer,
                      { backgroundColor: colors.success },
                    ]}
                  >
                    <Text style={styles.ratingText}>★ {provider.rating}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

// Mock data
const categories = [
  {
    id: "1",
    name: "Médicos",
    icon: (color: string) => <Calendar size={24} color={color} />,
  },
  {
    id: "2",
    name: "Estética",
    icon: (color: string) => <Calendar size={24} color={color} />,
  },
  {
    id: "3",
    name: "Esportes",
    icon: (color: string) => <Calendar size={24} color={color} />,
  },
  {
    id: "4",
    name: "Consultorias",
    icon: (color: string) => <Calendar size={24} color={color} />,
  },
  {
    id: "5",
    name: "Serviços",
    icon: (color: string) => <Calendar size={24} color={color} />,
  },
];

const providers = [
  { id: "1", name: "Dra. Ana Silva", specialty: "Cardiologista", rating: 4.9 },
  {
    id: "2",
    name: "Carlos Mendes",
    specialty: "Personal Trainer",
    rating: 4.7,
  },
  { id: "3", name: "Studio Beauty", specialty: "Estética", rating: 4.8 },
  {
    id: "4",
    name: "Dr. Roberto Gomes",
    specialty: "Nutricionista",
    rating: 4.6,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  appointmentsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingRight: 24,
    gap: 12,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    width: 100,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  providersContainer: {
    paddingHorizontal: 16,
    paddingRight: 24,
    gap: 16,
  },
  providerCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: 160,
    position: "relative",
  },
  providerImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0A7EA4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  providerSpecialty: {
    fontSize: 14,
  },
  ratingContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 24,
  },
});
