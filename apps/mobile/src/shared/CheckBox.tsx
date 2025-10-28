import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function CheckBox() {
  const [checked, setChecked] = useState(false);

  return (
    <Pressable
      onPress={() => setChecked(!checked)}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: checked ? '#4CAF50' : '#999',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: checked ? '#4CAF50' : 'transparent',
      }}
    >
      {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
    </Pressable>
  );
}
