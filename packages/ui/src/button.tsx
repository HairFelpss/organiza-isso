import React from "react";
import type {
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Pressable, Text } from "react-native";
import { theme } from "./theme";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const getButtonStyles = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  disabled: boolean = false,
  isHovered: boolean = false,
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.5 : 1,
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: {
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
    },
    md: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[5],
    },
    lg: {
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[6],
    },
  };

  // Variant styles
  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: isHovered
        ? theme.colors.light.buttonPrimaryHover
        : theme.colors.light.buttonPrimary,
    },
    secondary: {
      backgroundColor: isHovered
        ? theme.colors.light.buttonSecondaryHover
        : theme.colors.light.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.colors.light.border,
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

const getTextStyles = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
): TextStyle => {
  const baseStyle: TextStyle = {
    fontFamily: theme.typography.fonts.sans,
    fontWeight: theme.typography.weights.medium,
    textAlign: "center",
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, TextStyle> = {
    sm: { fontSize: theme.typography.sizes.sm },
    md: { fontSize: theme.typography.sizes.base },
    lg: { fontSize: theme.typography.sizes.lg },
  };

  // Variant styles
  const variantStyles: Record<ButtonVariant, TextStyle> = {
    primary: {
      color: theme.colors.light.buttonText,
    },
    secondary: {
      color: theme.colors.light.buttonTextSecondary,
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  disabled = false,
  ...props
}: ButtonProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Pressable
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        getButtonStyles(
          variant,
          size,
          disabled,
          isHovered,
        ),
        pressed && { opacity: 0.8 },
        style,
      ]}
      {...props}
    >
      <Text style={[getTextStyles(variant, size), textStyle]}>{children}</Text>
    </Pressable>
  );
};
