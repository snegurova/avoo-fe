import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileLanguages } from '../ProfileLanguages/ProfileLanguages';
import { ProfileCertificates } from '../ProfileCertificates/ProfileCertificates';
import { userHooks } from '@avoo/hooks';
import { useMemo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { RootScreens } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ProfileInfo() {
  const profileInfo = userHooks.useGetUserProfile();
  const navigation = useNavigation<NavigationProp>();

  const visualProfileInfo = useMemo(() => {
    return {
      name: profileInfo?.businessInfo?.name ?? 'Salon Name not set',
      description: profileInfo?.businessInfo?.description ?? 'Some description about the salon',
      address: profileInfo?.businessInfo?.address ?? 'Salon address not set',
      email: profileInfo?.email ?? 'Email not set',
      phone: profileInfo?.businessInfo?.phone ?? 'Phone not set',
    };
  }, [profileInfo]);

  const visualLanguages = useMemo(() => {
    return profileInfo?.businessInfo?.languages ?? null;
  }, [profileInfo]);

  const handleEdit = () => {
    navigation.navigate(RootScreens.EditProfileScreen);
  };

  return (
    <>
      <View className='bg-white border border-blue-500 rounded-xl p-4 mx-5 mb-4 relative'>
        <Pressable className='absolute top-4 right-4 p-1' onPress={handleEdit}>
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
