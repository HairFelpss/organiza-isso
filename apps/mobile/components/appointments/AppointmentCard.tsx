import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/theme-context";
import {
  CircleAlert as AlertCircle,
  Calendar,
  CircleCheck as CheckCircle2,
  Clock,
} from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
interface AppointmentCardProps {
  title: string;
  provider: string;
  dateTime: string;
  status: "pending" | "confirmed" | "canceled" | string;
  compact?: boolean;
}

export function AppointmentCard({
  title,
  provider,
  dateTime,
  status,
  compact = false,
}: AppointmentCardProps) {
  const { actualTheme } = useTheme();
  const colors = Colors[actualTheme];

  const getStatusColor = () => {
    switch (status) {
      case "confirmed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "canceled":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "canceled":
        return "Cancelado";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 size={16} color={colors.success} />;
      case "pending":
        return <Clock size={16} color={colors.warning} />;
      case "canceled":
        return <AlertCircle size={16} color={colors.error} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: getStatusColor(),
        },
        compact && styles.compactContainer,
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            compact && styles.compactTitle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.provider,
            { color: colors.textSecondary },
            compact && styles.compactProvider,
          ]}
          numberOfLines={1}
        >
          {provider}
        </Text>

        {!compact && (
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Calendar size={14} color={colors.textTertiary} />
              <Text
                style={[styles.detailText, { color: colors.textSecondary }]}
              >
                {dateTime}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor() },
              compact && styles.compactStatus,
            ]}
          >
            {getStatusText()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 16,
  },
  compactContainer: {
    padding: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  provider: {
    fontSize: 14,
    marginBottom: 8,
  },
  compactProvider: {
    fontSize: 12,
    marginBottom: 4,
  },
  details: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  compactStatus: {
    fontSize: 10,
  },
});
