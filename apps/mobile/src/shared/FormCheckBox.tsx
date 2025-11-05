import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: string;
}

export const FormCheckBox = <T extends FieldValues>(props: Props<T>) => {
  const { name, control, label, error } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <View>
      <View style={styles.container}>
        <Pressable
          onPress={() => field.onChange(!field.value)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: field.value ? '#2563EB' : error ? "red" : '#999',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: field.value ? '#2563EB' : 'transparent',
          }}
        >
          {field.value && <Ionicons name="checkmark" size={16} color="#fff" />}
        </Pressable>
        <Text style={styles.label}>{label}</Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

FormCheckBox.displayName = 'FormCheckBox';

const styles = StyleSheet.create({
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
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