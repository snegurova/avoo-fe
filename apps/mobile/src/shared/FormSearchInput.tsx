import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TextStyle,
  StyleProp,
  Text,
  Pressable,
} from 'react-native';
import { Chip } from 'react-native-paper';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { VALID_LANGUAGE_CODES, LANGUAGE_NAMES, type LanguageCode } from '@avoo/constants';
import { MaterialIcons } from './icons';
import { colors } from '@avoo/design-tokens';

type Props<T extends FieldValues> = TextInputProps & {
  containerStyle?: ViewStyle;
  error?: string;
  style?: StyleProp<TextStyle>;
  name: Path<T>;
  control: Control<T>;
};

function isLanguageCode(code: unknown): code is LanguageCode {
  if (typeof code !== 'string') return false;
  return VALID_LANGUAGE_CODES.some((validCode) => validCode === code);
}

export default function FormSearchInput<T extends FieldValues>(props: Props<T>) {
  const {
    name,
    control,
    containerStyle,
    style,
    error,
    placeholder = 'Search language',
    ...rest
  } = props;

  const { field } = useController({
    name,
    control,
  });

  const selectedItems = Array.isArray(field.value) ? field.value.filter(isLanguageCode) : [];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = VALID_LANGUAGE_CODES.filter((code) => {
    if (!searchQuery) return false;
    const name = LANGUAGE_NAMES[code].toLowerCase();
    const codeLower = code.toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || codeLower.includes(query);
  }).filter((code) => !selectedItems.includes(code));

  const handleAddItem = (code: LanguageCode) => {
    if (!selectedItems.includes(code)) {
      field.onChange([...selectedItems, code]);
    }
    setSearchQuery('');
  };

  const handleRemoveItem = (code: LanguageCode) => {
    field.onChange(selectedItems.filter((lang: LanguageCode) => lang !== code));
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <MaterialIcons name='search' size={24} color={colors.gray[500]} />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.gray[400]}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          {...rest}
        />
      </View>

      {searchQuery && filteredItems.length > 0 && (
        <View style={styles.resultsContainer}>
          {filteredItems.map((item) => (
            <Pressable key={item} style={styles.resultItem} onPress={() => handleAddItem(item)}>
              <Text style={styles.resultText}>
                {LANGUAGE_NAMES[item]} ({item.toUpperCase()})
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
      {selectedItems.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedItems.map((code: LanguageCode) => (
            <Chip
              key={code}
              mode='flat'
              style={styles.chip}
              textStyle={styles.chipText}
              onClose={() => handleRemoveItem(code)}
            >
              {LANGUAGE_NAMES[code]} ({code.toUpperCase()})
            </Chip>
          ))}
        </View>
      )}
    </View>
  );
}

FormSearchInput.displayName = 'FormSearchInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[100],
    marginRight: 4,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 14,
    color: colors.black,
  },
  chipClose: {
    padding: 2,
  },
  chipCloseText: {
    fontSize: 18,
    color: colors.black,
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.black,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.red[500],
  },
  resultsContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  resultText: {
    fontSize: 16,
    color: colors.black,
  },
  errorText: {
    color: colors.red[500],
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
