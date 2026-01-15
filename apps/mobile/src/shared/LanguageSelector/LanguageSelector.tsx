import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Control, FieldValues, Path, PathValue, useController } from 'react-hook-form';
import { Chip, Text } from 'react-native-paper';
import { LanguageSelectionModal } from '@/components/LanguageSelectionModal/LanguageSelectionModal';
import { LANGUAGE_NAMES, type LanguageCode } from '@avoo/constants';
import { colors } from '@avoo/design-tokens';
import { utils } from '@avoo/hooks';
import { MaterialIcons } from '../icons';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  error?: string;
};

export default function LanguageSelector<T extends FieldValues>({
  name,
  control,
  error,
}: Props<T>) {
  const { field } = useController({
    control,
    name,
    defaultValue: [] as PathValue<T, Path<T>>,
  });

  const selectedLanguages: LanguageCode[] = Array.isArray(field.value) ? field.value : [];

  const { value: isModalOpen, enable: handleOpenModal, disable: handleCloseModal } =
    utils.useBooleanState(false);

  const handleConfirm = (languages: LanguageCode[]) => {
    field.onChange(languages);
  };

  const handleRemoveLanguage = (code: LanguageCode) => {
    const updated = selectedLanguages.filter((lang) => lang !== code);
    field.onChange(updated);
  };

  return (
    <View className='w-full'>
      <View className='flex-row justify-between items-center mb-3'>
        <View className='flex-shrink pr-4'>
          <Text variant='titleMedium' className='mb-1'>Languages</Text>
          <Text variant='bodySmall' style={styles.description}>
            Add languages in which the service is offered
          </Text>
        </View>
        <Pressable
          onPress={handleOpenModal}
          className='w-8 h-8 rounded-full items-center justify-center'
          style={{ backgroundColor: colors.primary[400] }}
          hitSlop={8}
        >
          <MaterialIcons name='add' size={26} color={colors.white} />
        </Pressable>
      </View>

      {selectedLanguages.length > 0 && (
        <View className='flex-row flex-wrap gap-2'>
          {selectedLanguages.map((code) => (
            <Chip
              key={code}
              mode='flat'
              style={styles.chip}
              textStyle={styles.chipText}
              onClose={() => handleRemoveLanguage(code)}
              closeIcon={() => (
                <View className='w-5 h-5 rounded-full border-2 items-center justify-center bg-white border-gray-300'>
                  <MaterialIcons name='close' size={14} color={colors.black} />
                </View>
              )}
            >
              {LANGUAGE_NAMES[code]} ({code.toUpperCase()})
            </Chip>
          ))}
        </View>
      )}

      {error && <Text className='text-red-500 text-xs mt-1 ml-1'>{error}</Text>}

      <LanguageSelectionModal
        visible={isModalOpen}
        onClose={handleCloseModal}
        selectedLanguages={selectedLanguages}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    color: colors.gray[500],
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 18,
    backgroundColor: colors.primary[100],
    height: 36,
  },
  chipText: {
    fontFamily: 'Roboto-Regular',
    lineHeight: 14,
    color: colors.black,
    marginVertical: 10,
  },
});

LanguageSelector.displayName = 'LanguageSelector';
