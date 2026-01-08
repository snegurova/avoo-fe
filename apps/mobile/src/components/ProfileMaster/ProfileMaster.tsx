import { View } from 'react-native';
import { masterHooks } from '@avoo/hooks';
import { MasterCard } from '@/components/MasterCard/MasterCard';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';


export const ProfileMaster = () => {
  const mastersInfo = masterHooks.useGetMastersProfileInfo();


  return (
    <View className='py-4'>
      <SectionHeader title='Masters' />

      <View className='flex-row flex-wrap gap-4'>
        {mastersInfo?.map((master) => (
          <MasterCard key={master.id} master={master} />
        ))}
      </View>
    </View>
  );
};

export default ProfileMaster;
