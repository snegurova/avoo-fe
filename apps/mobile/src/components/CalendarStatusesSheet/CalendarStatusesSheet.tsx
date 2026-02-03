import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import { tv } from 'tailwind-variants';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { isFullSelection } from '@avoo/shared';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

export const CALENDAR_STATUSES = [
  { id: OrderStatus.PENDING, label: 'Pending' },
  { id: OrderStatus.CONFIRMED, label: 'Confirmed' },
  { id: OrderStatus.COMPLETED, label: 'Completed' },
  { id: OrderStatus.EXPIRED, label: 'Expired' },
  { id: OrderStatus.CANCELED, label: 'Canceled' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedStatuses: Set<OrderStatus>;
  setSelectedStatuses: (statuses: Set<OrderStatus>) => void;
};

export const CalendarStatusesSheet = (props: Props) => {
  const { visible, onClose, selectedStatuses, setSelectedStatuses } = props;
  const isAllStatusesSelected = isFullSelection(
    selectedStatuses.size,
    CALENDAR_STATUSES.length,
  );

  const handleAllStatusesToggle = () => {
    if (isAllStatusesSelected) {
      setSelectedStatuses(
        CALENDAR_STATUSES.length > 0 ? new Set([CALENDAR_STATUSES[0].id]) : new Set(),
      );
    } else {
      setSelectedStatuses(new Set(CALENDAR_STATUSES.map((s) => s.id)));
    }
  };

  const handleStatusToggle = (statusId: OrderStatus) => {
    const newSelected = new Set(selectedStatuses);
    if (newSelected.has(statusId)) {
      newSelected.delete(statusId);
    } else {
      newSelected.add(statusId);
    }
    setSelectedStatuses(newSelected);
  };

  const checkbox = tv({
    base: 'w-6 h-6 border-2 border-primary-500 rounded items-center justify-center mr-3',
    variants: {
      selected: {
        true: 'bg-primary-500',
        false: 'bg-transparent',
      },
    },
  });


  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <View className='border border-dashed border-primary-500 rounded-xl m-4'>
        <Pressable
          className='px-4 py-4 border-dashed border-primary-500'
          onPress={handleAllStatusesToggle}
        >
          <View className='flex-row items-center'>
            <View className={checkbox({ selected: isAllStatusesSelected })}>
              {isAllStatusesSelected && (
                <MaterialIcons name='check' size={16} color={colors.white} />
              )}
            </View>
            <Text variant='bodyMedium'>All Statuses</Text>
          </View>
        </Pressable>

        {CALENDAR_STATUSES.map((status) => {
          const isSelected = isAllStatusesSelected || selectedStatuses.has(status.id);
          return (
            <Pressable
              key={status.id}
              className='px-4 py-4 border-dashed border-primary-500'
              onPress={() => handleStatusToggle(status.id)}
            >
              <View className='flex-row items-center'>
                <View className={checkbox({ selected: isSelected })}>
                  {isSelected && (
                    <MaterialIcons name='check' size={16} color={colors.white} />
                  )}
                </View>
                <Text variant='bodyMedium'>{status.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </CustomBottomSheet>
  );
};
