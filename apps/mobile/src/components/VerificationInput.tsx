import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

interface VerificationInputProps {
  onCodeComplete?: (code: string) => void;
}

const VerificationInput: React.FC<VerificationInputProps> = ({ onCodeComplete }) => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      const pastedCode = text.slice(0, 6).split('');
      setCode(pastedCode.concat(new Array(6 - pastedCode.length).fill('')));
      onCodeComplete?.(pastedCode.join(''));
      inputRefs.current[5]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 6) {
      onCodeComplete?.(newCode.join(''));
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const inputStyle = {
    backgroundColor: 'black',
    borderRadius: 8,
    width: 50,
    height: 66,
    fontSize: 24,
    textAlign: 'center' as const,
    color: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={inputStyle}
          maxLength={index === 0 ? 6 : 1}
          placeholder='_'
          placeholderTextColor='white'
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType='number-pad'
          selectTextOnFocus
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'color-pseudo-elements-grey',
  },
});

export default VerificationInput;
