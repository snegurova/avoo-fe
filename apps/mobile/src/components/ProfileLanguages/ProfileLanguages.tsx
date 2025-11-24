import { View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp, RootScreens } from '@/types/navigation';


type Props = {
  languages: string[] | null;
};

export const ProfileLanguages = (props: Props) => {
  const { languages } = props;
  const navigation = useNavigation<RootNavigationProp>();

  const handleNavigate = () => {
    navigation.navigate(RootScreens.EditLanguagesScreen);
  };

  return (
    <View className='flex-row items-center justify-between px-5 py-3'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base text-slate-900'>
          {languages?.join(' ') ?? 'Languages not set'}
        </Text>
      </View>
      <Pressable className='p-1' onPress={handleNavigate}>
        <FontAwesome name='pencil' size={14} color='#64748b' />
      </Pressable>
    </View>
  );
};

export default ProfileLanguages;
