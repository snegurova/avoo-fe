'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { calendarHooks, orderHooks } from '@avoo/hooks';
import { OrderScheduleStatus, OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import OrderStatusChip from '@/_components/OrderStatusChip/OrderStatusChip';
import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';

const LOCALE_MAP = {
  en: 'en-US',
  pl: 'pl-PL',
  uk: 'uk-UA',
} as const;

function getAccentColor(status: OrderStatus, isOutOfSchedule: boolean): string {
  if (isOutOfSchedule) {
    return colors.red[800];
  }

  return status === OrderStatus.CONFIRMED ? colors.confirm : colors.orange[500];
}

function getLocale(localeParam?: string | string[]): keyof typeof LOCALE_MAP {
  if (typeof localeParam === 'string' && localeParam in LOCALE_MAP) {
    return localeParam as keyof typeof LOCALE_MAP;
  }

  return 'en';
}

function getOptionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

export default function NextAppointmentsWidget() {
  const params = useParams<{ locale: string }>();
  const locale = getLocale(params?.locale);
  const tWidget = useTranslations(
    'private.components.NextAppointmentsWidget.NextAppointmentsWidget',
  );
  const tHistory = useTranslations('private.components.ClientOrdersHistory.ClientOrdersHistory');
  const tCreate = useTranslations('private.orders.create');
  const appointments = orderHooks.useUpcomingAppointmentsByMaster(100);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const calendarParams = React.useMemo<PrivateCalendarQueryParams>(() => {
    if (appointments.length === 0) {
      const today = new Date();

      return {
        rangeFromDate: timeUtils.formatDate(today),
        rangeToDate: timeUtils.formatDate(today),
      };
    }

    const timestamps = appointments
      .map((appointment) => new Date(appointment.date).getTime())
      .filter((timestamp) => Number.isFinite(timestamp));
    if (timestamps.length === 0) {
      const today = new Date();

      return {
        rangeFromDate: timeUtils.formatDate(today),
        rangeToDate: timeUtils.formatDate(today),
      };
    }

    const startDate = new Date(Math.min(...timestamps));
    const endDate = new Date(Math.max(...timestamps));
    const masterIds = Array.from(new Set(appointments.map((appointment) => appointment.master.id)));

    return {
      rangeFromDate: timeUtils.formatDate(startDate),
      rangeToDate: timeUtils.formatDate(endDate),
      masterIds,
      orderStatuses: [OrderStatus.PENDING, OrderStatus.CONFIRMED],
    };
  }, [appointments]);

  const { data: calendar } = calendarHooks.useGetCalendar(calendarParams, {
    enabled: appointments.length > 0,
  });

  const outOfScheduleByOrderId = React.useMemo(() => {
    const map = new Map<number, boolean>();

    calendar?.forEach((calendarItem) => {
      calendarItem.days.forEach((day) => {
        day.events.forEach((event) => {
          map.set(event.id, event.isOutOfSchedule);
        });
      });
    });

    return map;
  }, [calendar]);

  React.useEffect(() => {
    setActiveIndex((prev) => {
      if (appointments.length === 0) {
        return 0;
      }

      return Math.min(prev, appointments.length - 1);
    });
  }, [appointments.length]);

  const localeCode = LOCALE_MAP[locale];
  const canGoBack = activeIndex > 0;
  const canGoNext = activeIndex < appointments.length - 1;

  const formatDateLabel = React.useCallback(
    (date: string) => {
      const dateObj = new Date(date);

      if (Number.isNaN(dateObj.getTime())) {
        return '--';
      }

      const today = timeUtils.toDayBegin(new Date());
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const target = timeUtils.toDayBegin(dateObj);
      const shortDate = dateObj.toLocaleDateString(localeCode, {
        day: 'numeric',
        month: 'short',
      });

      if (timeUtils.isSameDay(target, today)) {
        return tWidget('todayDate', { date: shortDate });
      }

      if (timeUtils.isSameDay(target, tomorrow)) {
        return tWidget('tomorrowDate', { date: shortDate });
      }

      return dateObj.toLocaleDateString(localeCode, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    },
    [localeCode, tWidget],
  );

  const visibleAppointments = React.useMemo(
    () =>
      appointments.map((appointment) => {
        const endTime = timeUtils.getEndTime(appointment.date, appointment.duration);
        const serviceName =
          appointment.service?.name ??
          appointment.combination?.name ??
          appointment.name ??
          tHistory('bookingFallback');
        const note = getOptionalString(appointment.notes);
        const phone = getOptionalString(appointment.customer.phone);
        const isAppointmentOutOfSchedule = outOfScheduleByOrderId.get(appointment.id) === true;

        const statusChips = [
          appointment.status,
          ...(isAppointmentOutOfSchedule ? [OrderScheduleStatus.OUT_OF_SCHEDULE] : []),
        ];

        return {
          id: appointment.id,
          accentColor: getAccentColor(appointment.status, isAppointmentOutOfSchedule),
          statusChips,
          dateLabel: formatDateLabel(appointment.date),
          timeLabel: `${timeUtils.getTime(appointment.date)}-${endTime}`,
          serviceName,
          durationLabel: timeUtils.getHumanDuration(appointment.duration),
          masterName: appointment.master?.name ?? tHistory('anyMaster'),
          clientName: appointment.customer.name || tCreate('Client'),
          phone,
          note,
          priceLabel: tHistory('priceInEuro', { price: appointment.price }),
        };
      }),
    [appointments, formatDateLabel, outOfScheduleByOrderId, tCreate, tHistory, tWidget],
  );

  if (visibleAppointments.length === 0) {
    return (
      <div className='px-4 pb-5 pt-1 md:px-5'>
        <div className='flex min-h-[214px] flex-col items-center justify-center rounded-lg border border-gray-200 px-6 text-center'>
          <p className='text-base font-semibold text-black'>{tHistory('noUpcomingAppt')}</p>
          <p className='mt-2 text-xs text-gray-500'>{tHistory('upcomingVisitsHint')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 px-4 pb-5 pt-1 md:px-5'>
      <div className='overflow-hidden'>
        <ul
          className='flex transition-transform duration-300 ease-out'
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {visibleAppointments.map((appointment) => (
            <li key={appointment.id} className='min-w-full'>
              <article className='flex h-full gap-3 rounded-lg border border-gray-200 px-4 py-3'>
                <div
                  className='w-1 shrink-0 rounded-sm'
                  style={{ backgroundColor: appointment.accentColor }}
                />
                <div className='flex min-w-0 flex-1 flex-col gap-6'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
                      <p className='text-base font-medium leading-none tracking-[0.04em] text-black'>
                        {appointment.dateLabel}
                      </p>
                      <p className='text-sm leading-none tracking-[0.04em] text-gray-700'>
                        {appointment.timeLabel}
                      </p>
                    </div>
                    <div className='flex flex-wrap items-start justify-end gap-2'>
                      {appointment.statusChips.map((status) => (
                        <OrderStatusChip key={status} status={status} />
                      ))}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <p className='text-sm font-medium leading-none tracking-[0.04em] text-black'>
                      {appointment.serviceName}
                    </p>
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500'>
                      <span>{appointment.durationLabel}</span>
                      <span className='text-sm leading-none text-black'>|</span>
                      <span className='inline-flex items-center gap-1'>
                        <Avatar name={appointment.masterName} size={AvatarSize.Small} />
                        <span className='text-xs text-gray-700'>{appointment.masterName}</span>
                      </span>
                      <span className='text-sm leading-none text-black'>|</span>
                      <span className='text-sm leading-none tracking-[0.04em] text-black'>
                        {appointment.priceLabel}
                      </span>
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-none tracking-[0.04em] text-gray-700'>
                      <span className='font-medium'>{appointment.clientName}</span>
                      {appointment.phone && (
                        <span className='font-normal text-gray-500'>{appointment.phone}</span>
                      )}
                    </div>
                    {appointment.note && (
                      <p className='text-xs leading-[1.25] text-gray-500'>{appointment.note}</p>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      {visibleAppointments.length > 1 && (
        <div className='grid grid-cols-[auto_1fr_auto] items-center gap-3'>
          <button
            type='button'
            className='inline-flex h-[34px] items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm leading-none text-gray-800 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50'
            disabled={!canGoBack}
            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
          >
            <ArrowBackIcon className='h-3.5 w-3.5 fill-gray-800' />
            <span>{tWidget('back')}</span>
          </button>

          <div className='flex items-center justify-center gap-2'>
            {visibleAppointments.map((appointment, index) => (
              <button
                key={appointment.id}
                type='button'
                aria-label={`${index + 1}`}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-gray-500' : 'bg-gray-200'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <button
            type='button'
            className='inline-flex h-[34px] items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm leading-none text-gray-800 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50'
            disabled={!canGoNext}
            onClick={() =>
              setActiveIndex((prev) => Math.min(prev + 1, visibleAppointments.length - 1))
            }
          >
            <span>{tWidget('next')}</span>
            <ArrowForwardIcon className='h-3.5 w-3.5 fill-gray-800' />
          </button>
        </div>
      )}
    </div>
  );
}
