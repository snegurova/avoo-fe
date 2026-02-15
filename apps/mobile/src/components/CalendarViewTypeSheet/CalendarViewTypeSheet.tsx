import { Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { timeUtils } from '@avoo/shared';
import { colors } from '@avoo/design-tokens';
import { CalendarView } from '@avoo/axios/types/apiTypes';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { CalendarMonthIcon, ViewDayIcon, ViewWeekIcon } from '@/icons';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';

type Props = {
  visible: boolean;
  onClose: () => void;
  setViewType: (view: CalendarViewType) => void;
  setDate: (date: Date) => void;
  setToDate: (date: Date) => void;
};

const setCurrentDate = (
  type: CalendarViewType,
  setDate: (d: Date) => void,
  setToDate: (d: Date) => void,
) => {
  const today = new Date();
  switch (type) {
    case CalendarViewType.DAY: {
      const range = timeUtils.getDayRange(today);
      setDate(range.start);
      setToDate(range.end);
      break;
    }
    case CalendarViewType.WEEK: {
      const range = timeUtils.getWeekRange(today);
      setDate(range.start);
      setToDate(range.end);
      break;
    }
    case CalendarViewType.MONTH: {
      const range = timeUtils.getMonthRange(today);
      setDate(range.start);
      setToDate(range.end);
      break;
    }
    default:
      break;
  }
};

export const CalendarViewTypeSheet = (props: Props) => {
  const { visible, onClose, setViewType, setDate, setToDate } = props;
  const handleViewPress = (view: CalendarViewType) => {
    setViewType(view);
    onClose();
    setCurrentDate(view, setDate, setToDate);
  };

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <Pressable
        className='px-6 py-4 border-b border-gray-200 flex-row items-center gap-2'
        onPress={() => handleViewPress(CalendarViewType.DAY)}
      >
        <ViewDayIcon size={24} color={colors.black} />
        <Text variant='titleMedium'>
          {CalendarView.Day.charAt(0).toUpperCase() + CalendarView.Day.slice(1)}
        </Text>
      </Pressable>
      <Pressable
        className='px-6 py-4 border-b border-gray-200 flex-row items-center gap-2'
        onPress={() => handleViewPress(CalendarViewType.WEEK)}
      >
        <ViewWeekIcon size={24} color={colors.black} />
        <Text variant='titleMedium'>
          {CalendarView.Week.charAt(0).toUpperCase() + CalendarView.Week.slice(1)}
        </Text>
      </Pressable>
      <Pressable
        className='px-6 py-4 flex-row items-center gap-2'
        onPress={() => handleViewPress(CalendarViewType.MONTH)}
      >
        <CalendarMonthIcon size={24} color={colors.black} />
        <Text variant='titleMedium'>
          {CalendarView.Month.charAt(0).toUpperCase() + CalendarView.Month.slice(1)}
        </Text>
      </Pressable>
    </CustomBottomSheet>
  );
};
