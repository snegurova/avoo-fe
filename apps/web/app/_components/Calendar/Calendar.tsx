import React, { useEffect, useState, useRef, useMemo } from 'react';
import CalendarColumn from '@/_components/CalendarColumn/CalendarColumn';
import CalendarColumnHead from '@/_components/CalendarColumnHead/CalendarColumnHead';
import CalendarTimeScale from '@/_components/CalendarTimeScale/CalendarTimeScale';
import { calendarHooks } from '@avoo/hooks';
import { PrivateCalendarQueryParams, PrivateEvent } from '@avoo/axios/types/apiTypes';
import { masterHooks } from '@avoo/hooks';
import CalendarControls from '@/_components/CalendarControls/CalendarControls';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { timeUtils } from '@avoo/shared';
import { tv } from 'tailwind-variants';
import CalendarMonthView from '@/_components/CalendarMonthView/CalendarMonthView';
import { PX_IN_MINUTE } from '@/_constants/time';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import CalendarWeekSingleMasterView from '@/_components/CalendarWeekSingleMasterView/CalendarWeekSingleMasterView';
import AsideModal from '@/_components/AsideModal/AsideModal';
import OrderData from '@/_components/OrderData/OrderData';
import CalendarClockIcon from '@/_icons/CalendarClockIcon';

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

type Props = {
  isWidget?: boolean;
};

export default function Calendar(props: Props) {
  const { isWidget = false } = props;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [date, setDate] = useState<Date>(timeUtils.toDayBegin(new Date()));
  const [toDate, setToDate] = useState<Date>(timeUtils.toDayEnd(new Date()));
  const [masterIds, setMasterIds] = useState<number[] | undefined>(undefined);
  const [statuses, setStatuses] = useState<OrderStatus[] | undefined>(undefined);
  const [orderIsOutOfSchedule, setOrderIsOutOfSchedule] = useState<boolean | undefined>(undefined);
  const [type, setType] = useState<CalendarViewType>(CalendarViewType.DAY);
  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: timeUtils.formatDate(date),
    rangeToDate: timeUtils.formatDate(toDate),
  });
  const [time, setTime] = useState(timeUtils.getMinutesInDay(new Date().toString()));
  const [selectedOrder, setSelectedOrder] = useState<PrivateEvent | null>(null);

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

  const scrollToCurrentTime = () => {
    if (
      type === CalendarViewType.MONTH ||
      !scrollRef.current ||
      (type === CalendarViewType.WEEK && filteredMasters.length !== 1)
    )
      return;

    let scrollOptions: {
      top?: number;
      left?: number;
      behavior?: 'auto' | 'smooth';
    } = {
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

    scrollToCurrentTime();
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

  return (
    <>
      <div className='flex h-[calc(100%-62px)] w-full'>
        <div className='w-full flex flex-col'>
          <CalendarControls
            date={date}
            setDate={setDate}
            toDate={toDate}
            setToDate={setToDate}
            type={type}
            setType={setType}
            scrollToCurrentTime={scrollToCurrentTime}
            params={params}
            setParams={setParams}
            masters={masters ?? []}
            masterIds={masterIds}
            setMasterIds={setMasterIds}
            statuses={statuses}
            setStatuses={setStatuses}
            orderIsOutOfSchedule={orderIsOutOfSchedule}
            setOrderIsOutOfSchedule={setOrderIsOutOfSchedule}
            isWidget={isWidget}
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
                          type={type}
                          date={date}
                          setDate={setDate}
                          setToDate={setToDate}
                          setType={setType}
                          time={time}
                          setTime={setTime}
                          selectOrder={setSelectedOrder}
                          availableBooking={!selectedOrder}
                        />
                      );
                    })}
                  {type === CalendarViewType.MONTH &&
                    new Date(params.rangeFromDate).getTime() + 28 * 24 * 60 * 60 * 1000 <=
                      new Date(params.rangeToDate).getTime() && (
                      <CalendarMonthView
                        params={params}
                        setDate={setDate}
                        setToDate={setToDate}
                        setType={setType}
                      />
                    )}
                </div>
              </>
            )}
            {isWeekSingleMasterView && (
              <CalendarWeekSingleMasterView
                date={date}
                time={time}
                setTime={setTime}
                data={calendar?.find(
                  (schedule) => String(schedule.master?.id) === String(filteredMasters[0].id),
                )}
                master={filteredMasters[0]}
                setDate={setDate}
                setToDate={setToDate}
                setType={setType}
                availableBooking={!selectedOrder}
              />
            )}
            {filteredMasters.length === 0 && (
              <AppPlaceholder
                title='No schedules'
                icon={<CalendarClockIcon className='w-20 h-20 lg:w-25 lg:h-25 fill-primary-300' />}
                description='There are currently no schedules to display. Choose masters to see their schedules here.'
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
