import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

/**
 * Props for the Button component
 * @property {() => void} onPress - Function to be called when button is pressed
 * @property {string} title - Text to display inside the button
 * @property {boolean} disabled - Whether the button is disabled (grayed out and non-interactive)
 * @property {boolean} loading - Whether to show loading spinner instead of title
 * @property {ViewStyle | ViewStyle[]} style - Custom styles for the button container
 * @property {TextStyle} textStyle - Custom styles for the button text
 */
interface ButtonProps {
    onPress: () => void;
    title: string;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle;
}

/**
 * A reusable button component with loading and disabled states
 * 
 * Features:
 * - Press animation with opacity feedback
 * - Loading state with spinner
 * - Disabled state
 * - Customizable styles
 * - Accessible touch target
 * 
 * Usage:
 * ```tsx
 * // Basic usage
 * <Button 
 *   title="Press Me" 
 *   onPress={() => console.log('pressed')} 
 * />
 * 
 * // With loading state
 * <Button
 *   title="Submit"
 *   loading={isLoading}
 *   onPress={handleSubmit}
 * />
 * 
 * // With custom styles
 * <Button
 *   title="Custom Button"
 *   style={customStyles.button}
 *   textStyle={customStyles.buttonText}
 *   onPress={handlePress}
 * />
 * ```
 */
export default function Button({ 
    onPress, 
    title, 
    disabled = false, 
    loading = false,
    style,
    textStyle, 
}: ButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                disabled && styles.buttonDisabled,
                pressed && !disabled && styles.buttonPressed,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </Pressable>
    );
}

/**
 * Styles for Button component
 * 
 * Structure:
 * - button: Base button styles with primary color and padding
 * - buttonDisabled: Reduced opacity for disabled state
 * - buttonPressed: Feedback opacity for pressed state
 * - text: Default text styles (color, size, weight)
 * 
 * Color scheme:
 * - Primary blue (#2563EB) for active state
 * - White text (#FFFFFF) for contrast
 * - Opacity variations for different states
 */
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2563EB', // Tailwind blue-600
        borderRadius: 8,           // Consistent with other components
        padding: 16,               // Comfortable touch target
        alignItems: "center",      // Center content horizontally
        marginTop: 8,             // Default spacing from elements above
    },
    buttonDisabled: {
        opacity: 0.6,             // Reduced visibility for disabled state
    },
    buttonPressed: {
        opacity: 0.8,             // Visual feedback for press
    },
    text: {
        color: '#FFFFFF',         // White text for contrast
        fontSize: 18,             // Readable size
        fontWeight: '600',        // Semi-bold for emphasis
    },
});