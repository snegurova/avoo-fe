import React from 'react';
import { View } from 'react-native';
import { tv } from 'tailwind-variants';
import { calendarConfig } from '../CalendarSection/calendarConfig';
import { TimeGridLines } from '../TimeGridLines/TimeGridLines';
import { calendarUtils } from '@/utils/calendarUtils';

type Props = {
  columnKey: string;
  width?: number;
  borderRight?: boolean;
  children: React.ReactNode;
};

const { hours, slotHeight } = calendarConfig.timeline;
const contentHeight = hours.length * slotHeight;


const column = tv({
  base: 'relative',
  variants: {
    borderRight: {
      true: 'border-r border-gray-200',
      false: '',
    },
  },
});

export const TimelineColumn = (props: Props) => {
  const { columnKey, width, borderRight = true, children } = props;
  return (
    <View
      style={calendarUtils.getColumnStyle(width, contentHeight)}
      className={column({ borderRight })}
    >
      <TimeGridLines columnKey={columnKey} />
      {children}
    </View>
  );
};
