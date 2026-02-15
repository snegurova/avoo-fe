import { Pressable, type PressableProps } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { tv } from 'tailwind-variants';
import type { Appointment } from '@/hooks/calendarHooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { BookmarkCheckIcon, CheckCircleIcon, InfoIcon, SearchActivityIcon } from '@/icons';
import { useMemo } from 'react';

export const CALENDAR_ORDER_VARIANT = {
  WEEK: 'week',
  MONTH: 'month',
  DAY: 'day',
  WIDGET: 'widget',
} as const;

type BaseProps = {
  appointment: Appointment;
  onPress?: PressableProps['onPress'];
};

type WeekProps = BaseProps & {
  variant: typeof CALENDAR_ORDER_VARIANT.WEEK;
};

type MonthProps = BaseProps & {
  variant: typeof CALENDAR_ORDER_VARIANT.MONTH;
};

type WidgetProps = BaseProps & {
  variant: typeof CALENDAR_ORDER_VARIANT.WIDGET;
};

type DayProps = BaseProps & {
  variant: typeof CALENDAR_ORDER_VARIANT.DAY;
  top: number;
  height: number;
  width?: number;
  zIndex?: number;
};

export type Props = WeekProps | DayProps | MonthProps | WidgetProps;

const orderCard = tv({
  base: 'border',
  variants: {
    status: {
      [OrderStatus.PENDING]: 'border-orange-500 bg-orange-50',
      [OrderStatus.CONFIRMED]: 'border-blue-700 bg-blue-50',
      [OrderStatus.COMPLETED]: 'border-purple-700 bg-purple-50',
      [OrderStatus.EXPIRED]: 'border-red-800 bg-red-50',
      [OrderStatus.CANCELED]: 'border-red-800 bg-red-50',
    },
  },
});

const orderText = tv({
  base: '',
  variants: {
    status: {
      [OrderStatus.PENDING]: 'text-orange-700',
      [OrderStatus.CONFIRMED]: 'text-blue-700',
      [OrderStatus.COMPLETED]: 'text-purple-700',
      [OrderStatus.EXPIRED]: 'text-red-800',
      [OrderStatus.CANCELED]: 'text-red-800',
    },
  },
});

const statusToIconColor: Record<Appointment['status'], string> = {
  [OrderStatus.PENDING]: colors.orange[700],
  [OrderStatus.CONFIRMED]: colors.blue[700],
  [OrderStatus.COMPLETED]: colors.purple[700],
  [OrderStatus.EXPIRED]: colors.red[800],
  [OrderStatus.CANCELED]: colors.red[800],
};

const VARIANT_LAYOUT_CLASS: Record<Props['variant'], string> = {
  [CALENDAR_ORDER_VARIANT.WEEK]: 'mb-1 rounded-md px-1 py-0.5 overflow-hidden',
  [CALENDAR_ORDER_VARIANT.MONTH]:
    'mb-1 rounded-md px-0.5 overflow-hidden flex-row items-center gap-0.5',
  [CALENDAR_ORDER_VARIANT.DAY]: 'absolute mx-1 rounded-lg p-2 overflow-hidden min-h-[40px]',
  [CALENDAR_ORDER_VARIANT.WIDGET]: 'rounded-md px-0.5 overflow-hidden flex-row items-center gap-0.5'
};

export function CalendarOrder(props: Props) {
  const { appointment, onPress } = props;
  const status = appointment.status as OrderStatus;
  const iconColor = statusToIconColor[appointment.status];
  const variant = props.variant;

  const calendarIcon = useMemo(() => {
    switch (status) {
      case OrderStatus.PENDING:
        return <SearchActivityIcon size={10} color={iconColor} />;
      case OrderStatus.CONFIRMED:
        return <BookmarkCheckIcon size={10} color={iconColor} />;
      case OrderStatus.COMPLETED:
        return <CheckCircleIcon size={10} color={iconColor} />;
      case OrderStatus.EXPIRED:
      case OrderStatus.CANCELED:
        return <InfoIcon size={10} color={iconColor} />;
    }
  }, [status, iconColor]);

  const cardClassName = `${VARIANT_LAYOUT_CLASS[variant]} ${orderCard({ status })}`;
  const style =
    variant === CALENDAR_ORDER_VARIANT.DAY
      ? {
          top: props.top,
          height: props.height,
          width: props.width ?? 112,
          zIndex: props.zIndex ?? 1,
        }
      : undefined;

  const textColor = iconColor;

  return (
    <Pressable onPress={onPress} className={cardClassName} style={style}>
      {variant === CALENDAR_ORDER_VARIANT.WEEK ? (
        <Text
          variant='labelSmall'
          numberOfLines={1}
          className={orderText({ status })}
          style={{ color: textColor }}
        >
          {appointment.startTime} {appointment.clientName}
        </Text>
      ) : variant === CALENDAR_ORDER_VARIANT.MONTH || variant === CALENDAR_ORDER_VARIANT.WIDGET ? (
        <>
          {calendarIcon}
          <Text
            variant='labelSmall'
            numberOfLines={1}
            className={orderText({ status })}
            style={{ fontSize: 9, color: textColor }}
          >
            {appointment.startTime}
          </Text>
        </>
      ) : (
        <>
          <Text
            variant='bodySmall'
            className={`font-medium ${orderText({ status })}`}
            numberOfLines={1}
            style={{ color: textColor }}
          >
            {appointment.startTime}
          </Text>
          {appointment.clientName && (
            <Text
              variant='bodySmall'
              numberOfLines={1}
              className={orderText({ status })}
              style={{ color: textColor }}
            >
              {appointment.clientName}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}

export default CalendarOrder;
