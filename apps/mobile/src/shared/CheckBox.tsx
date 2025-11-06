import { useCallback, memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  isChecked: boolean;
  errors: boolean;
  onValueChange: (value: boolean) => void;
}

function CheckBox(props: Props) {
  const { label, isChecked, errors, onValueChange } = props;

  const handlePress = useCallback(() => {
    onValueChange(!isChecked);
  }, [onValueChange, isChecked]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.checkbox,
          {
            borderColor: isChecked ? '#2563EB' : errors ? 'red' : '#999',
            backgroundColor: isChecked ? '#2563EB' : 'transparent',
          },
        ]}
      >
        {isChecked && <Ionicons name='checkmark' size={16} color='#fff' />}
      </Pressable>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default memo(CheckBox);


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
});

