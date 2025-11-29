import { View, Image, ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@/shared/icons';

type Props = {
  size?: number;
  imageUri?: string | ImageSourcePropType | null;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  editable?: boolean;
};

export const Avatar = (props: Props) => {
  const {
    size = 80,
    imageUri,
    iconName = 'person',
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
        <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
      )}
    
    </View>
  );
};

  export default Avatar;
