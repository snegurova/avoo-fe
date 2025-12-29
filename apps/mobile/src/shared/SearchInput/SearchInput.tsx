import { View, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { MaterialIcons } from '@/shared/icons';
import { colors, radius, typography } from '@avoo/design-tokens';

type Props = TextInputProps & {
  containerStyle?: ViewStyle;
};

export const SearchInput = ({ containerStyle, ...rest }: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        <MaterialIcons name='search' size={24} color={colors.gray[500]} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray[400]}
          placeholder='Search service name'
          {...rest}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    padding: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
    lineHeight: 20,
    color: colors.black,
  },
});

