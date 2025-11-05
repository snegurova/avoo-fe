import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  isChecked: boolean;
  errors: boolean;
  onValueChange: (value: boolean) => void;
}

export default function CheckBox(props: Props) {
  const { label, isChecked, errors, onValueChange } = props;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onValueChange(isChecked)}
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: isChecked ? '#2563EB' :  errors ? "red" : '#999',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isChecked ? '#2563EB' : 'transparent',
        }}
      >
        {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </Pressable>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
});