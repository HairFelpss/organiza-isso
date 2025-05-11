import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { Search, FileSliders as Sliders } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
}: SearchBarProps) {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <Search size={20} color={colors.icon} style={styles.searchIcon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          style={[styles.input, { color: colors.text }]}
          onChangeText={onSearch}
        />
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.backgroundTertiary },
          ]}
        >
          <Sliders size={16} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
