import { useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';
import { userHooks } from '@avoo/hooks';

import { GalleryEditBottomSheet } from '@/components/GalleryEditBottomSheet/GalleryEditBottomSheet';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';

const GAP = 2;

export const ProfileGallery = () => {
  const userMedia = userHooks.useGetUserMedia();
  const { userId } = userHooks.useGetUserProfile();
  const items = userMedia?.items ?? [];
  const isFetching = userMedia?.isFetching ?? false;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const photoSize = containerWidth > 0 ? (containerWidth - GAP * 2) / 3 : 0;

  return (
    <View className='relative'>
      <SectionHeader title='Gallery' onEdit={() => setIsEditOpen(true)} />

      {items.length === 0 ? (
        <View className='rounded-xl border border-gray-200 px-4 py-6'>
          <Text className='text-sm font-bold text-gray-900 text-center'>No photos in gallery</Text>
          <Text className='text-xs text-gray-500 text-center mt-1'>
            Your gallery photos will appear here.
          </Text>
        </View>
      ) : (
        <View
          className='flex-row flex-wrap'
          style={{ gap: GAP }}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {items.map((item) => (
            <Image
              key={item.id}
              source={{ uri: item.previewUrl || item.url }}
              style={{
                width: photoSize,
                height: 165,
                borderRadius: 8,
              }}
              resizeMode='cover'
            />
          ))}
        </View>
      )}

      {isFetching && (
        <View
          className='absolute inset-0 items-center justify-center bg-white/80 rounded-2xl'
          style={{ zIndex: 1 }}
        >
          <ActivityIndicator size='large' color={colors.primary[700]} />
        </View>
      )}

      <GalleryEditBottomSheet
        initialMedias={items}
        userId={userId}
        visible={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </View>
  );
};

export default ProfileGallery;
