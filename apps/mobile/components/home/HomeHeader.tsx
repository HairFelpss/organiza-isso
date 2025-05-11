import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { Bell } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
export function HomeHeader() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          Olá, João 👋
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Organiza Isso
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.notificationBtn,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <Bell size={20} color={colors.icon} />
        <View
          style={[
            styles.notificationBadge,
            { backgroundColor: colors.primary },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 10,
    right: 10,
  },
});
