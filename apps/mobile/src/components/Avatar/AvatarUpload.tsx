import { View, Image, ImageSourcePropType, Pressable, ActivityIndicator } from 'react-native';
import { imagePickerHooks } from '@/hooks/imagePickerHooks';
import { typeGuardHooks, UploadFile } from '@avoo/shared';
import { EditIcon, PersonIcon } from '@/icons';
import { colors } from '@avoo/design-tokens';


type Props = {
  size?: number;
  editIconSize?: number;
  imageUri?: string | ImageSourcePropType | null;
  iconSize?: number;
  onImageSelected: (file: UploadFile) => void;
  isUploading?: boolean;
};

export const AvatarUpload = (props: Props) => {
  const { size = 80, imageUri, iconSize = 30, onImageSelected, isUploading, editIconSize = 24 } = props;

  const handlePress = () => {
    imagePickerHooks.showImagePicker((file) => {
      onImageSelected(file);
    });
  };

  const displayUri = typeGuardHooks.isString(imageUri) ? imageUri : null;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isUploading}
      accessibilityRole='button'
      accessibilityLabel='Change avatar'
      accessibilityState={{ disabled: isUploading }}
    >
      <View style={{ width: size, height: size }}>
        <View
          className='bg-primary-50 items-center justify-center overflow-hidden'
          style={{ width: size, height: size, borderRadius: size / 2 }}
        >
          {isUploading ? (
            <ActivityIndicator size='small' color='#64748b' />
          ) : displayUri ? (
            <Image source={{ uri: displayUri }} className='w-full h-full' />
          ) : (
            <PersonIcon size={iconSize} color={colors.primary[200]} />
          )}
        </View>
        <View
          className='absolute bottom-0 right-0 items-center justify-center bg-white border border-gray-300 rounded-full w-11 h-11'
        >
          <EditIcon size={editIconSize} color={colors.gray[300]} />
        </View>
      </View>
    </Pressable>
  );
};

export default AvatarUpload;
