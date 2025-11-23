import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { masterHooks } from '@avoo/hooks';
import { MasterCard } from '@/components/MasterCard/MasterCard';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';
import { RootNavigationProp, RootScreens } from '@/types/navigation';


export const ProfileMaster = () => {
  const mastersInfo = masterHooks.useGetMastersProfileInfo();
  const navigation = useNavigation<RootNavigationProp>();

  const handleNavigate = () => {
    navigation.navigate(RootScreens.MastersScreen);
  };

  return (
    <View className='px-5 py-4'>
      <SectionHeader title='Masters' onEdit={handleNavigate} />

      <View className='flex-row flex-wrap gap-4'>
        {mastersInfo?.map((master) => (
          <MasterCard key={master.id} master={master} />
        ))}
      </View>
    </View>
  );
};

export default ProfileMaster;
