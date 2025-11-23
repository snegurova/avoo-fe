import { View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp, RootScreens } from '@/types/navigation';


export const ProfileCertificates = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const handleNavigate = () => {
    navigation.navigate(RootScreens.CertificatesScreen);
  };

  return (
    <View className='flex-row items-center justify-between px-5 py-3'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-base text-slate-900'>No Certificates</Text>
      </View>
      <Pressable className='p-1' onPress={handleNavigate}>
        <FontAwesome name='pencil' size={14} color='#64748b' />
      </Pressable>
    </View>
  );
};

export default ProfileCertificates;
