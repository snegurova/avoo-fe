import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { MediaEntity } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { mediaHooks, userHooks } from '@avoo/hooks';
import { UploadFile } from '@avoo/shared';

import { imagePickerHooks } from '@/hooks/imagePickerHooks';
import { uiHooks } from '@/hooks/uiHooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { ConfirmModal } from '@/shared/ConfirmModal/ConfirmModal';
import { MaterialIcons } from '@/shared/icons';

type Props = {
  initialMedias: MediaEntity[];
  userId: number | null;
  onClose: () => void;
};

export const GalleryEditForm = (props: Props) => {
  const { initialMedias, userId, onClose } = props;

  const [addedMedias, setAddedMedias] = useState<MediaEntity[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);

  const hasChanges = addedMedias.length > 0 || removedMediaIds.length > 0;

  const visibleMedias = [
    ...addedMedias,
    ...initialMedias.filter(
      (media) => !removedMediaIds.includes(media.id) && !addedMedias.some((a) => a.id === media.id),
    ),
  ];

  const { uploadMedia, isUploading } = mediaHooks.useUploadMedia({
    onSuccess: (data) => {
      setAddedMedias((prev) => [data, ...prev]);
    },
  });

  const { deleteMediaAsync } = mediaHooks.useDeleteMedia();
  const { handleUpdateProfileAsync } = userHooks.useUpdateProfile();

  const handlePickImage = () => {
    imagePickerHooks.showImagePicker((file: UploadFile) => {
      uploadMedia({ file, type: MEDIA_TYPE_ENUM.USER });
    });
  };

  const handleRemove = (mediaId: number) => {
    setRemovedMediaIds((prev) => (prev.includes(mediaId) ? prev : [...prev, mediaId]));
    setAddedMedias((prev) => prev.filter((media) => media.id !== mediaId));
  };

  const handleSubmit = async () => {
    if (userId && removedMediaIds.length > 0) {
      await Promise.all(
        removedMediaIds.map((mediaId) =>
          deleteMediaAsync({
            mediaId,
            params: { type: MEDIA_TYPE_ENUM.USER, typeEntityId: userId },
          }),
        ),
      );
    }

    await handleUpdateProfileAsync({ mediaIds: visibleMedias.map((media) => media.id) });
    onClose();
  };

  const { handleClose, isConfirmVisible, confirmDiscard, cancelDiscard } =
    uiHooks.useUnsavedChanges(hasChanges, onClose);

  const [galleryWidth, setGalleryWidth] = useState(0);
  const photoWidth = galleryWidth > 0 ? (galleryWidth - 4) / 3 : 0;

  return (
    <>
      <ConfirmModal
        visible={isConfirmVisible}
        onClose={cancelDiscard}
        onCancel={cancelDiscard}
        onConfirm={confirmDiscard}
        title='Unsaved changes'
        description='You have unsaved changes. Are you sure you want to leave?'
        onCancelText='Cancel'
        onConfirmText='Discard changes'
      />
      <BottomSheetHeader handleClose={handleClose} handleConfirm={handleSubmit} />
      <ScrollView
        className='px-5'
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className='text-xl font-bold text-gray-900 mb-4'>Gallery</Text>

        {visibleMedias.length > 0 && (
          <View
            className='flex-row flex-wrap mb-4'
            style={{ gap: 2 }}
            onLayout={(e) => setGalleryWidth(e.nativeEvent.layout.width)}
          >
            {visibleMedias.map((media) => (
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
                  onPress={() => handleRemove(media.id)}
                >
                  <MaterialIcons name='close' size={14} color={colors.white} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable
          className='items-center justify-center rounded-xl border border-gray-200 py-8'
          style={{ opacity: isUploading ? 0.6 : 1 }}
          onPress={handlePickImage}
          disabled={isUploading}
        >
          <MaterialIcons name='cloud-upload' size={32} color={colors.primary[300]} />
          <Text className='text-sm font-medium text-gray-900 mt-2'>
            Select a file or drag and drop here
          </Text>
          <Text className='text-xs text-gray-400 mt-1'>
            Upload up to 5 images (JPG, PNG, max 10MB each)
          </Text>
          <View className='mt-3 border border-gray-300 rounded-md px-4 py-2'>
            <Text className='text-sm text-gray-700'>Select file</Text>
          </View>
        </Pressable>
      </ScrollView>
    </>
  );
};
