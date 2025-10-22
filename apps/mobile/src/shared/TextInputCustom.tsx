import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';

/**
 * Props for the TextInputCustom component
 * Extends standard TextInput props with additional customization options
 * 
 * @property {React.ReactNode} rightIcon - Icon component to display on the right side
 * @property {() => void} onRightIconPress - Handler for right icon press (e.g., toggle password visibility)
 * @property {ViewStyle} containerStyle - Custom styles for the container wrapper
 * @property {string} error - Error message (changes border color to red)
 * @property {StyleProp<TextStyle>} style - Custom styles for the input itself
 */
interface TextInputCustomProps extends TextInputProps {
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  error?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * A customizable text input component with support for right icon and error states
 * 
 * Features:
 * - Right icon support with press handler
 * - Error state styling
 * - Custom styling for both container and input
 * - Forward ref support for direct input access
 * - Consistent styling with other components
 * 
 * Usage:
 * ```tsx
 * // Basic usage
 * <TextInputCustom
 *   placeholder="Enter text"
 *   value={value}
 *   onChangeText={setValue}
 * />
 * 
 * // With password toggle
 * <TextInputCustom
 *   secureTextEntry={!showPassword}
 *   rightIcon={<Icon name={showPassword ? "eye" : "eye-slash"} />}
 *   onRightIconPress={() => setShowPassword(!showPassword)}
 * />
 * 
 * // With error state
 * <TextInputCustom
 *   value={email}
 *   onChangeText={setEmail}
 *   error={emailError}
 * />
 * ```
 */
export const TextInputCustom = React.forwardRef<TextInput | null, TextInputCustomProps>(({
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  error,
  ...props
}, ref) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          rightIcon && styles.inputWithIcon,
          error && styles.inputError,
          style,
        ].filter(Boolean) as StyleProp<TextStyle>}
        placeholderTextColor="#94A3B8"
        {...props}
      />

      {rightIcon && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
});

// Set display name for React DevTools
TextInputCustom.displayName = 'TextInputCustom';

/**
 * Styles for TextInputCustom component
 * 
 * Structure:
 * - container: Wrapper with relative positioning for icon placement
 * - input: Base input styles with consistent borders and padding
 * - inputWithIcon: Modified padding when icon is present
 * - inputError: Error state styling
 * - iconContainer: Positioning and alignment for right icon
 * 
 * Color scheme:
 * - Border: Slate-200 (#E2E8F0) for normal state
 * - Background: Slate-50 (#F8FAFC) for subtle contrast
 * - Text: Slate-900 (#0F172A) for good readability
 * - Placeholder: Slate-400 (#94A3B8) for secondary text
 * - Error: Red-500 (#EF4444) for error state
 */
const styles = StyleSheet.create({
  container: {
    position: 'relative',  // Enable absolute positioning of icon
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',    // Tailwind slate-200
    borderRadius: 8,           // Consistent with other components
    padding: 16,               // Comfortable touch target
    fontSize: 16,              // Readable text size
    backgroundColor: '#F8FAFC', // Tailwind slate-50
    color: '#0F172A',          // Tailwind slate-900
  },
  inputWithIcon: {
    paddingRight: 48,         // Space for icon (16px padding + 24px icon + 8px gap)
  },
  inputError: {
    borderColor: '#EF4444',   // Tailwind red-500
  },
  iconContainer: {
    position: 'absolute',     // Overlay on input
    right: 16,               // Align with input padding
    top: 0,
    bottom: 0,
    justifyContent: 'center', // Center icon vertically
    alignItems: 'center',     // Center icon horizontally
  },
});