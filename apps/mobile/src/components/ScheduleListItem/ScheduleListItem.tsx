import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScheduleEntity } from '@avoo/axios/types/apiTypes';
import { colors, typography } from '@avoo/design-tokens';

import { GroupIcon } from '@/icons';
import { Avatar } from '@/shared/Avatar/Avatar';
import { scheduleUtils } from '@/utils/scheduleUtils';

type Props = {
  schedule: ScheduleEntity;
  onPress?: () => void;
};

export const ScheduleListItem = (props: Props) => {
  const { schedule, onPress } = props;
  const patternLabel = scheduleUtils.getPatternLabel(schedule.pattern);

  return (
    <Pressable
      onPress={onPress}
      className='mb-3 rounded-md bg-white px-4 py-3.5 border border-gray-200 active:opacity-70'
    >
      <View className='flex-row justify-between gap-2 mb-2'>
        <Text variant='titleSmall' style={{ color: colors.gray[700] }}>
          {schedule.name}
        </Text>
        {!!patternLabel && (
          <Text variant='bodySmall' style={{ color: colors.gray[500] }}>
            {patternLabel}
          </Text>
        )}
      </View>

      <View className='flex-row items-center'>
        {schedule.master ? (
          <>
            <Avatar
              backgroundColor={colors.primary[200]}
              size={16}
              textStyle={{ fontSize: 10, lineHeight: 10 }}
              uri={schedule.master.avatarPreviewUrl || schedule.master.avatarUrl}
              name={schedule.master.name}
            />
            <Text className='ml-2 text-sm text-gray-700'>{schedule.master.name}</Text>
          </>
        ) : (
          <View className='flex-row items-center gap-2'>
            <GroupIcon width={14} height={14} fill={colors.black} />
            <Text variant='bodySmall' style={{ color: colors.gray[700] }}>
              All Masters
            </Text>
          </View>
        )}
      </View>
      <View className='h-[1px] bg-primary-100 my-3' />
      <View className='justify-between gap-3'>
        <View className='flex-row justify-between gap-2'>
          <Text variant='bodySmall' style={{ color: colors.gray[500] }}>
            Start date:
          </Text>
          <Text
            variant='titleSmall'
            style={{ color: colors.black, fontSize: typography.fontSize.xs }}
          >
            {scheduleUtils.formatDate(schedule.startAt)}
          </Text>
        </View>
        <View className='flex-row justify-between gap-2'>
          <Text variant='bodySmall' style={{ color: colors.gray[500] }}>
            End date:
          </Text>
          <Text
            variant='titleSmall'
            style={{ color: colors.black, fontSize: typography.fontSize.xs }}
          >
            {scheduleUtils.formatDate(schedule.endAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
