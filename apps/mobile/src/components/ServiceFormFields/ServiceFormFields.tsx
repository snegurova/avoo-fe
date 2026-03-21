import { useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';

import {
  Category,
  MasterWithRelationsEntityResponse,
  MediaEntity,
} from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { CreateServiceFormData } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import FormTextInput from '@/shared/FormTextInput';
import { MaterialIcons } from '@/shared/icons';

import { AvatarDisplay } from '../Avatar/AvatarDisplay';
import { CategoryPickerSheet } from '../CreateServiceBottomSheet/CategoryPickerSheet';
import { DurationPickerSheet } from '../CreateServiceBottomSheet/DurationPickerSheet';
import { MasterPickerSheet } from '../CreateServiceBottomSheet/MasterPickerSheet';
import { LockedField } from '../LockedField/LockedField';
import { ServiceGalleryField } from './ServiceGalleryField';

type Props = {
  control: Control<CreateServiceFormData>;
  errors: FieldErrors<CreateServiceFormData>;
  setValue: UseFormSetValue<CreateServiceFormData>;
  getValues: UseFormGetValues<CreateServiceFormData>;
  categories: Category[];
  masters: MasterWithRelationsEntityResponse[];
  medias: MediaEntity[];
  onPickImage: () => void;
  onRemoveMedia: (id: number) => void;
  isUploading: boolean;
  maxPhotos?: number;
};

export const ServiceFormFields = (props: Props) => {
  const {
    control,
    errors,
    setValue,
    getValues,
    categories,
    masters,
    medias,
    onPickImage,
    onRemoveMedia,
    isUploading,
    maxPhotos = 5,
  } = props;

  const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);
  const [isDurationPickerVisible, setIsDurationPickerVisible] = useState(false);
  const [isMasterPickerVisible, setIsMasterPickerVisible] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(
    () => categories.find((c) => c.id === getValues('categoryId'))?.name ?? null,
  );

  return (
    <>
      {/* Service name */}
      <View className='mb-4'>
        <Text className='text-sm font-medium text-gray-900 mb-2'>Service name *</Text>
        <FormTextInput
          name='name'
          control={control}
          placeholder='e.g. Balayage'
          error={errors.name?.message}
        />
      </View>

      {/* Category */}
      <View className='mb-4'>
        <Text className='text-sm font-medium text-gray-900 mb-2'>Category *</Text>
        <LockedField
          value={selectedCategoryName ?? 'Select category'}
          isPlaceholder={!selectedCategoryName}
          error={!!errors.categoryId}
          onPress={() => setIsCategoryPickerVisible(true)}
        />
        {errors.categoryId && (
          <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.categoryId.message}</Text>
        )}
      </View>

      {/* Price */}
      <View className='mb-4'>
        <Text className='text-sm font-medium text-gray-900 mb-2'>Price (€) *</Text>
        <Controller
          name='price'
          control={control}
          render={({ field }) => (
            <View
              className='flex-row items-center rounded-lg bg-white border px-4'
              style={{ borderColor: errors.price ? colors.red[500] : colors.gray[200] }}
            >
              <Text className='text-base text-gray-500 mr-2'>€</Text>
              <TextInput
                className='flex-1 text-base text-gray-900 py-4'
                placeholder='0'
                placeholderTextColor={colors.gray[400]}
                keyboardType='numeric'
                value={field.value ? String(field.value) : ''}
                onChangeText={(text) => field.onChange(text ? Number(text) : undefined)}
                onBlur={field.onBlur}
              />
            </View>
          )}
        />
        {errors.price && (
          <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.price.message}</Text>
        )}
      </View>

      {/* Duration */}
      <View className='mb-4'>
        <Text className='text-sm font-medium text-gray-900 mb-2'>Service duration *</Text>
        <Controller
          name='durationMinutes'
          control={control}
          render={({ field }) => (
            <LockedField
              value={timeUtils.convertDuration(field.value ?? 15)}
              error={!!errors.durationMinutes}
              onPress={() => setIsDurationPickerVisible(true)}
            />
          )}
        />
        {errors.durationMinutes && (
          <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.durationMinutes.message}</Text>
        )}
      </View>

      {/* Description */}
      <View className='mb-6'>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-sm font-medium text-gray-900'>Description</Text>
                <Text className='text-xs text-gray-400'>{(field.value ?? '').length}/200</Text>
              </View>
              <TextInput
                className='rounded-lg bg-white border border-gray-200 px-4 py-3 text-base text-gray-900'
                style={{ minHeight: 90, textAlignVertical: 'top' }}
                placeholder='Describe your service...'
                placeholderTextColor={colors.gray[400]}
                multiline
                maxLength={200}
                value={field.value ?? ''}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              {errors.description && (
                <Text className='text-red-500 text-xs mt-1 ml-1'>{errors.description.message}</Text>
              )}
              <Text className='text-xs text-gray-400 mt-1'>
                Information will display on the platform.
              </Text>
            </>
          )}
        />
      </View>

      {/* Masters */}
      <Text className='text-base font-semibold text-gray-900 mb-4'>Masters</Text>
      <Controller
        name='masterIds'
        control={control}
        render={({ field }) => {
          const selectedMasters = masters.filter((m) => field.value.includes(m.id));
          return (
            <View className='mb-6'>
              <LockedField
                value={
                  field.value.length === 0 ? 'Select masters' : `${field.value.length} selected`
                }
                isPlaceholder={field.value.length === 0}
                error={!!errors.masterIds}
                onPress={() => setIsMasterPickerVisible(true)}
              />
              {errors.masterIds && (
                <Text className='text-red-500 text-xs mt-1 ml-1'>
                  {typeof errors.masterIds.message === 'string'
                    ? errors.masterIds.message
                    : 'At least one master is required'}
                </Text>
              )}
              {selectedMasters.map((master) => (
                <View
                  key={master.id}
                  className='flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mt-2'
                >
                  <AvatarDisplay
                    size={36}
                    imageUri={master.avatarPreviewUrl ?? master.avatarUrl}
                    iconSize={18}
                  />
                  <View className='flex-1 ml-3'>
                    <Text className='text-sm font-semibold text-gray-900'>{master.name}</Text>
                    {master.headline ? (
                      <Text className='text-xs text-gray-500'>{master.headline}</Text>
                    ) : null}
                  </View>
                  <Pressable
                    hitSlop={8}
                    onPress={() => field.onChange(field.value.filter((id) => id !== master.id))}
                  >
                    <MaterialIcons name='close' size={18} color={colors.gray[400]} />
                  </Pressable>
                </View>
              ))}

              <MasterPickerSheet
                visible={isMasterPickerVisible}
                onClose={() => setIsMasterPickerVisible(false)}
                masters={masters}
                selectedIds={field.value}
                onConfirm={field.onChange}
              />
            </View>
          );
        }}
      />

      {/* Available for online booking */}
      <Controller
        name='isActive'
        control={control}
        render={({ field }) => (
          <View className='flex-row items-center justify-between mb-6'>
            <Text className='text-base font-semibold text-gray-900'>
              Available for online booking
            </Text>
            <Switch
              value={field.value ?? true}
              onValueChange={field.onChange}
              trackColor={{ false: colors.gray[300], true: colors.primary[700] }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.gray[300]}
            />
          </View>
        )}
      />

      {/* Gallery */}
      <ServiceGalleryField
        medias={medias}
        onPickImage={onPickImage}
        onRemoveMedia={onRemoveMedia}
        isUploading={isUploading}
        maxPhotos={maxPhotos}
      />

      {/* Picker sheets */}
      <CategoryPickerSheet
        visible={isCategoryPickerVisible}
        onClose={() => setIsCategoryPickerVisible(false)}
        categories={categories}
        selectedId={getValues('categoryId') ?? null}
        onSelect={(id, name) => {
          setValue('categoryId', id, { shouldValidate: true, shouldDirty: true });
          setSelectedCategoryName(name);
        }}
      />

      <DurationPickerSheet
        visible={isDurationPickerVisible}
        onClose={() => setIsDurationPickerVisible(false)}
        selectedMinutes={getValues('durationMinutes') ?? 15}
        onSelect={(minutes) =>
          setValue('durationMinutes', minutes, { shouldValidate: true, shouldDirty: true })
        }
      />
    </>
  );
};
