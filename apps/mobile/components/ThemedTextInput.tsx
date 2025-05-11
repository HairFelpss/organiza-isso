```tsx
import { forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ThemedTextInputProps extends TextInputProps {
  label?: string;
}

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  ({ style, label, ...props }, ref) => {
    const backgroundColor = useThemeColor({}, "input");
    const borderColor = useThemeColor({}, "inputBorder");
    const textColor = useThemeColor({}, "text");
    const placeholderColor = useThemeColor({}, "inputPlaceholder");

    return (
      <View style={styles.container}>
        {label && (
          <ThemedText style={styles.label}>{label}</ThemedText>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor,
              borderColor,
              color: textColor,
            },
            style,
          ]}
          placeholderTextColor={placeholderColor}
          {...props}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

ThemedTextInput.displayName = "ThemedTextInput";
```