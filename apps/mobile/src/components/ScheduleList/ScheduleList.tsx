import { ActivityIndicator, FlatList } from 'react-native';

import { ScheduleEntity } from '@avoo/axios/types/apiTypes';
import { scheduleHooks } from '@avoo/hooks';

import { ScheduleListItem } from '@/components/ScheduleListItem/ScheduleListItem';

type Props = {
  onSelectSchedule: (schedule: ScheduleEntity) => void;
};

export const ScheduleList = (props: Props) => {
  const { onSelectSchedule } = props;
  const { data, isFetching, fetchNextPage, hasNextPage } = scheduleHooks.useGetSchedulesInfinite({
    limit: 10,
  });
  const schedules = data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  if (isFetching && schedules.length === 0) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={schedules}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ paddingBottom: 24 }}
      renderItem={({ item }) => (
        <ScheduleListItem schedule={item} onPress={() => onSelectSchedule(item)} />
      )}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
    />
  );
};
