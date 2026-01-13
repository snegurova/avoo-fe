import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { LANGUAGE_NAMES, type LanguageCode } from '@avoo/constants';
import { languageHooks } from '@avoo/hooks';
import { colors } from '@avoo/design-tokens';
import { MaterialIcons } from '@/shared/icons';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedLanguages: LanguageCode[];
  onConfirm: (languages: LanguageCode[]) => void;
};

export const LanguageSelectionModal = (props: Props) => {
  const { visible, onClose, selectedLanguages, onConfirm } = props;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<LanguageCode[]>(selectedLanguages);

  useEffect(() => {
    if (visible) {
      setTempSelected(selectedLanguages);
      setSearchQuery('');
    }
  }, [visible, selectedLanguages]);

  const filteredLanguages = languageHooks.useFilterLanguages(searchQuery);

  const handleToggleLanguage = (code: LanguageCode) => {
    setTempSelected((prev) =>
      prev.includes(code) ? prev.filter((lang) => lang !== code) : [...prev, code],
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onClose();
  };

  const handleClose = () => {
    setTempSelected(selectedLanguages);
    setSearchQuery('');
    onClose();
  };

  return (
    <CustomBottomSheet visible={visible} onClose={handleClose} disableSwipeToClose={false}>
      <BottomSheetHeader handleClose={handleClose} handleConfirm={handleConfirm} />
      <View
        className='flex-1 px-4'
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
      >
        <View className='flex-row items-center px-3 mb-4 bg-gray-50 border border-gray-200 rounded-lg'>
          <MaterialIcons name='search' size={20} color={colors.gray[500]} />
          <TextInput
            className='flex-1 py-3 text-base text-black ml-2'
            placeholder='Search languages...'
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView className='flex-1' showsVerticalScrollIndicator={true}>
          {filteredLanguages.map((code) => {
            const isSelected = tempSelected.includes(code);
            return (
              <Pressable
                key={code}
                className='flex-row items-center justify-between py-4 border-b border-gray-200'
                onPress={() => handleToggleLanguage(code)}
              >
                <Text className='text-base text-black'>
                  {LANGUAGE_NAMES[code]} ({code.toUpperCase()})
                </Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <MaterialIcons name='check' size={16} color={colors.white} />}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </CustomBottomSheet>
  );
};

