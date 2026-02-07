import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { phoneHooks } from '@avoo/hooks';
import { colors } from '@avoo/design-tokens';
import { MaterialIcons } from '@/shared/icons';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { SearchInput } from '@/shared/SearchInput/SearchInput';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';

type Props = {
  visible: boolean;
  onClose: () => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
};

export const PhoneBottomSheet = (props: Props) => {
  const { visible, onClose, countryCode, setCountryCode } = props;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCodes = phoneHooks.useFilterPhoneCodes(searchQuery);

  return (
    <CustomBottomSheet
      visible={visible}
      onClose={onClose}
      disableSwipeToClose={false}
      snapPoint='92%'
    >
      <BottomSheetHeader handleClose={onClose} handleConfirm={onClose} />
      <View
        className='flex-1 px-4 pb-4 min-h-0'
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
      >
        <View className='mb-4'>
          <SearchInput
            placeholder='Search country code (+45, +38...)'
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType='phone-pad'
          />
        </View>
        <ScrollView
          className='flex-1 min-h-0'
          contentContainerStyle={{ paddingRight: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator
        >
          {filteredCodes.map((opt) => {
            const isSelected = countryCode === opt.value;
            return (
              <Pressable
                key={opt.value}
                className='flex-row items-center justify-between py-3 border-b border-gray-100'
                onPress={() => setCountryCode(opt.value)}
              >
                <Text className='text-base text-black'>{opt.label}</Text>
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
