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

TextInputCustom.displayName = 'TextInputCustom';


const styles = StyleSheet.create({
  container: {
    position: 'relative', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',    
    borderRadius: 8,           
    padding: 16,               
    fontSize: 16,              
    backgroundColor: '#F8FAFC', 
    color: '#0F172A',          
  },
  inputWithIcon: {
    paddingRight: 48,         
  },
  inputError: {
    borderColor: '#EF4444',   
  },
  iconContainer: {
    position: 'absolute',     
    right: 16,               
    top: 0,
    bottom: 0,
    justifyContent: 'center', 
    alignItems: 'center',     
  },
});