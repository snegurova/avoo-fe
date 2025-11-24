import { View, Image, ImageSourcePropType } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  size?: number;
  imageUri?: string | ImageSourcePropType | null;
  iconName?: keyof typeof FontAwesome.glyphMap;
  iconColor?: string;
  iconSize?: number;
  editable?: boolean;
};

export const Avatar = (props: Props) => {
  const {
    size = 80,
    imageUri,
    iconName = 'user',
    iconColor = '#64748b',
    iconSize = 30,
  } = props;
  const displayUri = typeof imageUri === 'string' ? imageUri : null;

  return (
    <View
      className='bg-gray-300 items-center justify-center overflow-hidden'
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      {displayUri ? (
        <Image source={{ uri: displayUri }} className='w-full h-full' />
      ) : (
        <FontAwesome name={iconName} size={iconSize} color={iconColor} />
      )}
    
    </View>
  );
};

  export default Avatar;
