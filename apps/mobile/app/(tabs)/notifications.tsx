import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import {
  CircleAlert as AlertCircle,
  Calendar,
  CircleCheck as CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
export default function NotificationsScreen() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];

  // Group notifications by date
  const groupedNotifications = notificationsMock.reduce(
    (groups, notification) => {
      const date = notification.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    },
    {} as Record<string, typeof notificationsMock>,
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Notificações</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedNotifications).map(
          ([date, notifications], groupIndex) => (
            <Animated.View
              key={date}
              entering={FadeIn.duration(500).delay(100 * groupIndex)}
            >
              <Text
                style={[styles.dateHeader, { color: colors.textSecondary }]}
              >
                {date}
              </Text>

              <View style={styles.notificationsGroup}>
                {notifications.map((notification, index) => (
                  <Animated.View
                    key={notification.id}
                    entering={FadeInRight.duration(400).delay(50 * index)}
                  >
                    <TouchableOpacity
                      style={[
                        styles.notificationCard,
                        {
                          backgroundColor: notification.read
                            ? colors.background
                            : colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor: getIconBackgroundColor(
                              notification.type,
                              colors,
                            ),
                          },
                        ]}
                      >
                        {getNotificationIcon(
                          notification.type,
                          getIconColor(notification.type, colors),
                        )}
                      </View>

                      <View style={styles.notificationContent}>
                        <Text
                          style={[
                            styles.notificationTitle,
                            { color: colors.text },
                            notification.read && { fontWeight: "400" },
                          ]}
                        >
                          {notification.title}
                        </Text>
                        <Text
                          style={[
                            styles.notificationMessage,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {notification.message}
                        </Text>

                        <View style={styles.notificationMeta}>
                          <Text
                            style={[
                              styles.notificationTime,
                              { color: colors.textTertiary },
                            ]}
                          >
                            {notification.time}
                          </Text>

                          {!notification.read && (
                            <View
                              style={[
                                styles.unreadIndicator,
                                { backgroundColor: colors.primary },
                              ]}
                            />
                          )}
                        </View>
                      </View>

                      <ChevronRight size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          ),
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

// Helper functions to determine icon and colors based on notification type
const getNotificationIcon = (type: string, color: string) => {
  switch (type) {
    case "appointment_confirmed":
      return <CheckCircle2 size={20} color={color} />;
    case "appointment_reminder":
      return <Calendar size={20} color={color} />;
    case "appointment_canceled":
      return <AlertCircle size={20} color={color} />;
    default:
      return <Info size={20} color={color} />;
  }
};

const getIconBackgroundColor = (type: string, colors: any) => {
  switch (type) {
    case "appointment_confirmed":
      return colors.success + "20"; // 20% opacity
    case "appointment_reminder":
      return colors.info + "20";
    case "appointment_canceled":
      return colors.error + "20";
    default:
      return colors.primary + "20";
  }
};

const getIconColor = (type: string, colors: any) => {
  switch (type) {
    case "appointment_confirmed":
      return colors.success;
    case "appointment_reminder":
      return colors.info;
    case "appointment_canceled":
      return colors.error;
    default:
      return colors.primary;
  }
};

// Mock data for notifications
const notificationsMock = [
  {
    id: "1",
    type: "appointment_confirmed",
    title: "Agendamento confirmado",
    message: "Sua consulta com Dra. Ana Silva foi confirmada.",
    date: "Hoje",
    time: "15:30",
    read: false,
  },
  {
    id: "2",
    type: "appointment_reminder",
    title: "Lembrete de agendamento",
    message: "Seu horário na Barbearia Central é amanhã às 10:00.",
    date: "Hoje",
    time: "12:15",
    read: false,
  },
  {
    id: "3",
    type: "appointment_canceled",
    title: "Agendamento cancelado",
    message: "Sua sessão de fisioterapia foi cancelada pelo profissional.",
    date: "Ontem",
    time: "18:42",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Avalie seu atendimento",
    message:
      "Como foi sua consulta com Dr. Roberto Gomes? Deixe uma avaliação.",
    date: "Ontem",
    time: "16:30",
    read: true,
  },
  {
    id: "5",
    type: "appointment_confirmed",
    title: "Agendamento confirmado",
    message: "Sua aula de pilates foi confirmada para o próximo sábado.",
    date: "23/05/2025",
    time: "09:10",
    read: true,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  notificationsGroup: {
    paddingHorizontal: 16,
    gap: 8,
  },
  notificationCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  bottomPadding: {
    height: 24,
  },
});
