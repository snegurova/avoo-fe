import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

/**
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

export default function Button(props: ButtonProps) {
    const { onPress, title, disabled = false, loading = false, style, textStyle } = props;

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


const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2563EB', 
        borderRadius: 8,          
        padding: 16,              
        alignItems: "center",      
        marginTop: 8,             
    },
    buttonDisabled: {
        opacity: 0.6,            
    },
    buttonPressed: {
        opacity: 0.8,            
    },
    text: {
        color: '#FFFFFF',         
        fontSize: 18,             
        fontWeight: '600',        
    },
});