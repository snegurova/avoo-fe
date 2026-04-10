import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';

import { MaterialIcons } from '@/shared/icons';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: string;
};

export default function FormCheckBox<T extends FieldValues>(props: Props<T>) {
  const { name, control, label, error } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => field.onChange(!field.value)}
        style={[
          styles.checkbox,
          {
            borderColor: error && !field.value ? colors.red['500'] : colors.gray['900'],
            backgroundColor: field.value ? colors.gray['900'] : 'transparent',
          },
        ]}
      >
        {field.value && <MaterialIcons name='check' size={16} color={colors.white} />}
      </Pressable>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

FormCheckBox.displayName = 'FormCheckBox';

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
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.64,
    color: colors.gray['900'],
    flex: 1,
  },
});
