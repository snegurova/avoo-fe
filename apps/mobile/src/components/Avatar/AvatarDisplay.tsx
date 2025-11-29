import { View, Image, ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  size?: number;
  imageUri?: string | ImageSourcePropType | null;
  iconSize?: number;
};

export const AvatarDisplay = (props: Props) => {
  const { size = 80, imageUri, iconSize = 30 } = props;

  const displayUri = typeof imageUri === 'string' ? imageUri : null;

  return (
    <View
      className='bg-gray-300 items-center justify-center overflow-hidden'
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      {displayUri ? (
        <Image source={{ uri: displayUri }} className='w-full h-full' />
      ) : (
        <MaterialIcons name='person' size={iconSize} color='#64748b' />
      )}
    </View>
  );
};

export default AvatarDisplay;
