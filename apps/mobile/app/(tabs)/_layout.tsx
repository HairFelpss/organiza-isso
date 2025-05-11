import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { Tabs } from "expo-router";
import { Bell, Calendar, Chrome as Home, User } from "lucide-react-native";
export default function TabLayout() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];

  console.log("TabLayout colors", colors);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary as string,
        tabBarInactiveTintColor: colors.textSecondary as string,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text as string,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificações",
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
