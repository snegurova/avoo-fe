import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useRouter, useSearchParams } from 'next/navigation';

import { tv } from 'tailwind-variants';

import {
  MasterWithRelationsEntity,
  PrivateCalendarQueryParams,
  PrivateEvent,
} from '@avoo/axios/types/apiTypes';
import { calendarHooks, masterHooks } from '@avoo/hooks';
import { CalendarType } from '@avoo/hooks/types/calendarType';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { OrderQueryParams } from '@avoo/hooks/types/orderQueryParams';
import { messages } from '@avoo/intl/messages/private/calendar/calendar';
import { timeUtils } from '@avoo/shared';
import { useCalendarStore } from '@avoo/store';

import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import AsideModal from '@/_components/AsideModal/AsideModal';
import CalendarColumn from '@/_components/CalendarColumn/CalendarColumn';
import CalendarColumnHead from '@/_components/CalendarColumnHead/CalendarColumnHead';
import CalendarControls from '@/_components/CalendarControls/CalendarControls';
import CalendarMonthView from '@/_components/CalendarMonthView/CalendarMonthView';
import CalendarTimeScale from '@/_components/CalendarTimeScale/CalendarTimeScale';
import CalendarWeekSingleMasterView from '@/_components/CalendarWeekSingleMasterView/CalendarWeekSingleMasterView';
import OrderData from '@/_components/OrderData/OrderData';
import { PX_IN_MINUTE } from '@/_constants/time';
import { localizationHooks } from '@/_hooks/localizationHooks';
import CalendarClockIcon from '@/_icons/CalendarClockIcon';
import { AppRoutes } from '@/_routes/routes';

const calendarWrapper = tv({
  base: 'flex w-full',
  variants: {
    calendarType: {
      [CalendarType.REGULAR]: 'h-[calc(100%-62px)]',
      [CalendarType.WIDGET]: 'h-[calc(100%-62px)]',
      [CalendarType.SELECTOR]: 'h-full',
    },
  },
});

const columnHeadContainer = tv({
  base: 'sticky bg-white z-10 ',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'flex pl-10.5 top-0 ',
      [CalendarViewType.WEEK]: 'flex left-0 flex flex-col',
      [CalendarViewType.MONTH]: 'hidden',
    },
  },
});

const mainContainer = tv({
  base: 'overflow-auto relative',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'min-w-full h-full',
      [CalendarViewType.WEEK]: 'w-full h-full flex',
      [CalendarViewType.MONTH]: 'h-full',
    },
    isWeekSingleMasterView: {
      true: 'flex-col',
      false: '',
    },
  },
});

const dataContainer = tv({
  base: 'flex ',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'h-580 pb-4 min-w-min',
      [CalendarViewType.WEEK]: 'flex flex-col grow',
      [CalendarViewType.MONTH]: 'flex flex-col grow h-full',
    },
  },
});

type ScrollOptions = {
  top?: number;
  left?: number;
  behavior?: 'auto' | 'smooth';
};

type Props = {
  calendarType?: CalendarType;
  onClickDateTime?: (date: string, master: MasterWithRelationsEntity) => void;
};

export default function Calendar(props: Props) {
  const { calendarType = CalendarType.REGULAR, onClickDateTime } = props;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const date = useCalendarStore((state) => state.date);
  const setDate = useCalendarStore((state) => state.setDate);
  const toDate = useCalendarStore((state) => state.toDate);
  const setToDate = useCalendarStore((state) => state.setToDate);
  const masterIds = useCalendarStore((state) => state.masterIds);
  const statuses = useCalendarStore((state) => state.statuses);
  const orderIsOutOfSchedule = useCalendarStore((state) => state.orderIsOutOfSchedule);
  const type = useCalendarStore((state) => state.type);
  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: timeUtils.formatDate(date),
    rangeToDate: timeUtils.formatDate(toDate),
  });
  const [time, setTime] = useState(timeUtils.getMinutesInDay(new Date().toString()));
  const [selectedOrder, setSelectedOrder] = useState<PrivateEvent | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      rangeFromDate: timeUtils.formatDate(date),
      rangeToDate: timeUtils.formatDate(toDate),
      masterIds,
      orderStatuses: statuses,
      orderIsOutOfSchedule,
    }));
  }, [date, toDate, masterIds, statuses, orderIsOutOfSchedule]);

  const calendarPath = localizationHooks.useWithLocale(AppRoutes.Calendar);

  const scrollToCurrentTime = () => {
    if (
      type === CalendarViewType.MONTH ||
      !scrollRef.current ||
      (type === CalendarViewType.WEEK && filteredMasters.length !== 1)
    )
      return;

    let scrollOptions: ScrollOptions = {
      behavior: 'smooth',
    };
    if (
      timeUtils.isSameDay(date, new Date()) ||
      (type === CalendarViewType.WEEK &&
        filteredMasters.length === 1 &&
        timeUtils.isCurrentWeek(date))
    ) {
      scrollOptions.top = time * PX_IN_MINUTE - (scrollRef.current.clientHeight - 76) / 2;
    } else {
      scrollOptions.top = 0;
    }

    if (type === CalendarViewType.WEEK && filteredMasters.length === 1) {
      const dayOfWeek = new Date().getDay();
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const columnWidth = scrollRef.current.scrollWidth / 7;
      scrollOptions.left = dayIndex * columnWidth;
    }

    scrollRef.current.scrollTo(scrollOptions);
  };

  const { data: calendar, refetch } = calendarHooks.useGetCalendar(params, {
    enabled: type !== CalendarViewType.MONTH,
  });

  const masters = masterHooks.useGetMastersProfileInfo()?.items;

  const filteredMasters = useMemo(() => {
    if (!masters || (masterIds && masterIds.length === 0)) return [];
    if (!masterIds) return masters;
    return masters.filter((master) => masterIds.includes(Number(master.id)));
  }, [masters, masterIds]);

  useEffect(() => {
    if (
      type === CalendarViewType.MONTH ||
      (type === CalendarViewType.WEEK && filteredMasters.length !== 1)
    )
      return;

    const date = searchParams.get(OrderQueryParams.Date);
    if (date) {
      const parsedDate = timeUtils.toDayBegin(new Date(date));
      setDate(parsedDate);
      setToDate(timeUtils.toDayEnd(parsedDate));

      if (searchParams.toString()) {
        router.replace(calendarPath);
      }

      if (!scrollRef.current) return;

      let scrollOptions: ScrollOptions = {
        behavior: 'smooth',
        top:
          timeUtils.getMinutesInDay(date) * PX_IN_MINUTE -
          (scrollRef.current.clientHeight - 76) / 2,
      };

      scrollRef.current.scrollTo(scrollOptions);
    } else {
      scrollToCurrentTime();
    }
  }, [type, filteredMasters]);

  const isWeekSingleMasterView = useMemo(() => {
    return type === CalendarViewType.WEEK && filteredMasters.length === 1;
  }, [type, filteredMasters]);

  const closeOrderModal = () => {
    const id = selectedOrder?.id;
    setTimeout(() => {
      setSelectedOrder((prev) => (prev?.id === id ? null : prev));
    }, 0);
  };

  const selectMasterIdByClick = (date: string, master: MasterWithRelationsEntity) => {
    if (!onClickDateTime) return;

    onClickDateTime(date, master);
  };

  return (
    <>
      <div className={calendarWrapper({ calendarType })}>
        <div className='w-full flex flex-col'>
          <CalendarControls
            scrollToCurrentTime={scrollToCurrentTime}
            params={params}
            setParams={setParams}
            masters={masters ?? []}
            calendarType={calendarType}
          />
          <div className={mainContainer({ type, isWeekSingleMasterView })} ref={scrollRef}>
            {filteredMasters.length > 0 && !isWeekSingleMasterView && (
              <>
                <div className={columnHeadContainer({ type })}>
                  {filteredMasters.map((master, idx) => (
                    <CalendarColumnHead
                      key={`${master.id}-head`}
                      master={master}
                      idx={idx}
                      type={type}
                      calendarType={calendarType}
                    />
                  ))}
                </div>

                <div className={dataContainer({ type })}>
                  <CalendarTimeScale type={type} date={date} time={time} setTime={setTime} />
                  {type !== CalendarViewType.MONTH &&
                    filteredMasters.map((master) => {
                      const columnData = calendar?.find(
                        (schedule) => String(schedule.master?.id) === String(master.id),
                      );
                      return (
                        <CalendarColumn
                          key={`${master.id}-col`}
                          data={columnData}
                          master={master}
                          time={time}
                          setTime={setTime}
                          selectOrder={setSelectedOrder}
                          availableBooking={!selectedOrder}
                          calendarType={calendarType}
                          onClickDateTime={selectMasterIdByClick}
                        />
                      );
                    })}
                  {type === CalendarViewType.MONTH &&
                    new Date(params.rangeFromDate).getTime() + 28 * 24 * 60 * 60 * 1000 <=
                      new Date(params.rangeToDate).getTime() && (
                      <CalendarMonthView params={params} />
                    )}
                </div>
              </>
            )}
            {isWeekSingleMasterView && (
              <CalendarWeekSingleMasterView
                time={time}
                setTime={setTime}
                data={calendar?.find(
                  (schedule) => String(schedule.master?.id) === String(filteredMasters[0].id),
                )}
                master={filteredMasters[0]}
                availableBooking={!selectedOrder}
                calendarType={calendarType}
              />
            )}
            {filteredMasters.length === 0 && (
              <AppPlaceholder
                title={<FormattedMessage {...messages.noSchedules} />}
                icon={<CalendarClockIcon className='w-20 h-20 xl:w-25 xl:h-25 fill-primary-300' />}
                description={<FormattedMessage {...messages.noSchedulesDescription} />}
              />
            )}
          </div>
        </div>
      </div>
      <AsideModal open={!!selectedOrder} handleClose={closeOrderModal}>
        {selectedOrder && (
          <OrderData
            orderId={selectedOrder.id}
            onClose={closeOrderModal}
            refetchCalendar={refetch}
            isOutOfSchedule={selectedOrder.isOutOfSchedule}
          />
        )}
      </AsideModal>
    </>
  );
}
