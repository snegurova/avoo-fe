import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { MediaEntity } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';

import { MaterialIcons } from '@/shared/icons';

type Props = {
  medias: MediaEntity[];
  onPickImage: () => void;
  onRemoveMedia: (id: number) => void;
  isUploading: boolean;
  maxPhotos?: number;
};

export const ServiceGalleryField = (props: Props) => {
  const { medias, onPickImage, onRemoveMedia, isUploading, maxPhotos = 5 } = props;

  const [galleryWidth, setGalleryWidth] = useState(0);
  const photoWidth = galleryWidth > 0 ? (galleryWidth - 4) / 3 : 0;

  return (
    <>
      <Text className='text-base font-semibold text-gray-900 mb-4'>Gallery</Text>
      <View
        className='flex-row flex-wrap'
        style={{ gap: 2 }}
        onLayout={(e) => setGalleryWidth(e.nativeEvent.layout.width)}
      >
        {medias.map((media) => (
          <View
            key={media.id}
            className='relative overflow-hidden'
            style={{ width: photoWidth, height: 165, borderRadius: 8 }}
          >
            <Image
              source={{ uri: media.previewUrl ?? media.url }}
              style={{ width: photoWidth, height: 165 }}
              resizeMode='cover'
            />
            <Pressable
              className='absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 items-center justify-center'
              onPress={() => onRemoveMedia(media.id)}
            >
              <MaterialIcons name='close' size={14} color={colors.white} />
            </Pressable>
          </View>
        ))}

        {medias.length < maxPhotos && (
          <Pressable
            className='items-center justify-center'
            style={{
              width: photoWidth,
              height: 165,
              borderRadius: 8,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: colors.gray[900],
              opacity: isUploading ? 0.6 : 1,
            }}
            onPress={onPickImage}
            disabled={isUploading}
          >
            <MaterialIcons name='add' size={28} color={colors.gray[900]} />
            <Text className='text-xs text-gray-500 mt-1'>Add photo</Text>
          </Pressable>
        )}
      </View>
    </>
  );
};
