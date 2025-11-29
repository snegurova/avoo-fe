import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileLanguages } from '../ProfileLanguages/ProfileLanguages';
import { ProfileCertificates } from '../ProfileCertificates/ProfileCertificates';
import { userHooks } from '@avoo/hooks';
import { FontAwesome } from '@expo/vector-icons';
import { RootNavigationProp, RootScreens } from '@/types/navigation';


export function ProfileInfo() {
  const { visualProfileInfo, visualLanguages } = userHooks.useGetUserProfile();
  const navigation = useNavigation<RootNavigationProp>();

  const handleNavigate = () => {
    navigation.navigate(RootScreens.EditProfileScreen);
  };

  return (
    <>
      <View className='bg-white border border-blue-500 rounded-xl p-4 mx-5 mb-4 relative flex-1'>
        <Pressable className='absolute top-4 right-4 p-1' onPress={handleNavigate}>
          <FontAwesome name='pencil' size={14} color='#64748b' />
        </Pressable>
        <View className='flex-1 pr-8'>
          <Text className='text-2xl font-bold text-slate-900 mb-2'>{visualProfileInfo.name}</Text>
          <Text className='text-sm text-slate-500 leading-5'>{visualProfileInfo.description}</Text>
          <Text className='text-base font-semibold text-slate-900 mb-2 mt-4'>
            {visualProfileInfo.name}
          </Text>
          <Text className='text-sm text-slate-500 mb-1'>{visualProfileInfo.address}</Text>
          <Text className='text-sm text-slate-500 mb-1'>{visualProfileInfo.email}</Text>
          <Text className='text-sm text-slate-500 mb-1'>{visualProfileInfo.phone}</Text>
        </View>
      </View>
      <ProfileLanguages languages={visualLanguages} />
      <ProfileCertificates />
    </>
  );
}

export default ProfileInfo;
