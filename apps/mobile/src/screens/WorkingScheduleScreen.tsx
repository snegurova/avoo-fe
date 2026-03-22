import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScheduleEntity } from '@avoo/axios/types/apiTypes';

import { CreateScheduleBottomSheet } from '@/components/CreateScheduleBottomSheet/CreateScheduleBottomSheet';
import { EditScheduleBottomSheet } from '@/components/EditScheduleBottomSheet/EditScheduleBottomSheet';
import { ScheduleList } from '@/components/ScheduleList/ScheduleList';
import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.WorkingScheduleScreen>;

export const WorkingScheduleScreen = (props: Props) => {
  const { navigation } = props;

  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleEntity | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Layout showBack onBackPress={() => navigation.goBack()} isScrollableDisabled>
      <View className='flex-row justify-between items-center mb-4 leading-[30px] tracking-[0.04px]'>
        <Text className='text-xl font-bold text-black ml-4'>Working schedule</Text>
        <Pressable
          className='flex-row items-center border border-primary-700 rounded-md px-4 py-3.5 gap-4'
          onPress={() => setIsCreateOpen(true)}
        >
          <Text className='text-md font-bold text-primary-700 leading-4'>New</Text>
        </Pressable>
      </View>

      <ScheduleList
        onSelectSchedule={setSelectedSchedule}
        onCreatePress={() => setIsCreateOpen(true)}
      />

      <EditScheduleBottomSheet
        schedule={selectedSchedule}
        visible={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
      />

      <CreateScheduleBottomSheet visible={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </Layout>
  );
};

export default WorkingScheduleScreen;
