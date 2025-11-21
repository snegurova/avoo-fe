import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { masterHooks } from '@avoo/hooks';
import { MasterCard } from '@/components/MasterCard/MasterCard';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';
import { RootScreens } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileMaster = () => {
  const mastersInfo = masterHooks.useGetMastersProfileInfo();
  const navigation = useNavigation<NavigationProp>();

  const handleEdit = () => {
    navigation.navigate(RootScreens.MastersScreen);
  };

  return (
    <View className='px-5 py-4'>
      <SectionHeader title='Masters' onEdit={handleEdit} />

      <View className='flex-row flex-wrap gap-4'>
        {mastersInfo.map((master) => (
          <MasterCard key={master.id} master={master} />
        ))}
      </View>
    </View>
  );
};

export default ProfileMaster;
