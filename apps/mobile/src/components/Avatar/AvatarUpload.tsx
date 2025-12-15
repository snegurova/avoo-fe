import { View, Image, ImageSourcePropType, Pressable, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { imagePickerHooks } from '@/hooks/imagePickerHooks';
import { UploadFile } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

type Props = {
  size?: number;
  imageUri?: string | ImageSourcePropType | null;
  iconSize?: number;
  onImageSelected: (file: UploadFile) => void;
};

export const AvatarUpload = (props: Props) => {
  const { size = 80, imageUri, iconSize = 30, onImageSelected } = props;

  const isPending = useApiStatusStore((state) => state.isPending);

  const handlePress = () => {
    imagePickerHooks.showImagePicker((file) => {
      onImageSelected(file);
    });
  };

  const displayUri = typeof imageUri === 'string' ? imageUri : null;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isPending}
      accessibilityRole='button'
      accessibilityLabel='Change avatar'
      accessibilityState={{ disabled: isPending }}
    >
      <View
        className='bg-gray-300 items-center justify-center overflow-hidden'
        style={{ width: size, height: size, borderRadius: size / 2 }}
      >
        {isPending ? (
          <ActivityIndicator size='small' color='#64748b' />
        ) : displayUri ? (
          <Image source={{ uri: displayUri }} className='w-full h-full' />
        ) : (
          <MaterialIcons name='person' size={iconSize} color='#64748b' />
        )}
      </View>
    </Pressable>
  );
};

export default AvatarUpload;
