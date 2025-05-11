import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
// Get days of the week
const getDaysOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;

  return Array(7)
    .fill(0)
    .map((_, index) => {
      const newDate = new Date(date);
      newDate.setDate(diff + index);
      return newDate;
    });
};

export default function AgendaScreen() {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = getDaysOfWeek(currentDate);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Format date to display day of week and date
  const formatDay = (date: Date) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[date.getDay()];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Agenda</Text>
      </View>

      <Animated.View
        entering={FadeIn.duration(600)}
        style={[
          styles.calendarContainer,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <View style={styles.weekHeader}>
          <TouchableOpacity onPress={goToPreviousWeek}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.monthText, { color: colors.text }]}>
            {currentDate.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </Text>

          <TouchableOpacity onPress={goToNextWeek}>
            <ChevronRight size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {daysOfWeek.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayItem,
                isSelected(date) && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                { borderColor: colors.border },
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dayName,
                  {
                    color: isSelected(date)
                      ? colors.buttonText
                      : colors.textSecondary,
                  },
                ]}
              >
                {formatDay(date)}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isToday(date) && { fontWeight: "700" },
                  {
                    color: isSelected(date)
                      ? colors.buttonText
                      : isToday(date)
                        ? colors.primary
                        : colors.text,
                  },
                ]}
              >
                {date.getDate()}
              </Text>
              {isToday(date) && !isSelected(date) && (
                <View
                  style={[styles.todayDot, { backgroundColor: colors.primary }]}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>

        <View style={styles.timelineContainer}>
          {getTimeSlots().map((slot, index) => (
            <Animated.View
              key={index}
              entering={FadeIn.duration(400).delay(50 * index)}
              style={[styles.timeSlot, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                {slot.time}
              </Text>

              <View style={styles.appointmentSlot}>
                {slot.appointment ? (
                  <AppointmentCard
                    title={slot.appointment.title}
                    provider={slot.appointment.provider}
                    dateTime={slot.time}
                    status={slot.appointment.status}
                    compact
                  />
                ) : (
                  <View
                    style={[
                      styles.emptySlot,
                      {
                        backgroundColor: colors.backgroundTertiary,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.emptySlotText,
                        { color: colors.textTertiary },
                      ]}
                    >
                      Disponível
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

// Mock data for time slots
const getTimeSlots = () => {
  return [
    { time: "08:00", appointment: null },
    { time: "09:00", appointment: null },
    {
      time: "10:00",
      appointment: {
        title: "Consulta Médica",
        provider: "Dra. Ana Silva",
        status: "confirmed",
      },
    },
    { time: "11:00", appointment: null },
    { time: "12:00", appointment: null },
    { time: "13:00", appointment: null },
    { time: "14:00", appointment: null },
    {
      time: "15:00",
      appointment: {
        title: "Corte de Cabelo",
        provider: "Barbearia Central",
        status: "pending",
      },
    },
    { time: "16:00", appointment: null },
    { time: "17:00", appointment: null },
    { time: "18:00", appointment: null },
    { time: "19:00", appointment: null },
  ];
};

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
  calendarContainer: {
    paddingVertical: 16,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  daysContainer: {
    paddingHorizontal: 12,
    gap: 8,
  },
  dayItem: {
    width: 50,
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 8,
  },
  dayName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "500",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  timelineContainer: {
    paddingHorizontal: 16,
  },
  timeSlot: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  timeText: {
    width: 50,
    fontSize: 14,
    fontWeight: "500",
  },
  appointmentSlot: {
    flex: 1,
    paddingLeft: 16,
  },
  emptySlot: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptySlotText: {
    fontSize: 14,
    textAlign: "center",
  },
  bottomPadding: {
    height: 24,
  },
});
