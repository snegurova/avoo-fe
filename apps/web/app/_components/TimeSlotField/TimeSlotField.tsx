import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import {
  Combination,
  GetPublicCalendarResponse,
  PublicCalendarQueryParams,
  Service,
} from '@avoo/axios/types/apiTypes';
import { TimeOfDay } from '@avoo/hooks/types/timeOfDay';
import { timeUtils } from '@avoo/shared';
import { useCalendarStore } from '@avoo/store';

import TimeSlotOption from '../TimeSlotOption/TimeSlotOption';

const MS_IN_MINUTE = 60000;

type Props = {
  selectedSlot: Date | null;
  setSelectedSlot: (date: Date | null) => void;
  selectedService: Service | Combination | null;
  userId: number;
  calendar: GetPublicCalendarResponse | null;
  calendarParams: PublicCalendarQueryParams;
  isError: boolean;
  setStep: (step: number) => void;
  isTheSameDay: boolean;
};

const button = tv({
  base: 'px-4 py-2 rounded-full border text-sm leading-none text-black disabled:text-gray-600 disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-auto transition-colors',
  variants: {
    active: {
      true: 'border-black',
      false: 'border-gray-200 cursor-pointer hover:bg-gray-200 focus:bg-gray-200',
    },
  },
});

export default function TimeSlotField(props: Props) {
  const t = useTranslations('public.salon.createOrder');
  const {
    selectedSlot,
    setSelectedSlot,
    selectedService,
    calendar,
    calendarParams,
    setStep,
    isTheSameDay,
  } = props;
  const [morningSlots, setMorningSlots] = useState<Date[]>([]);
  const [afternoonSlots, setAfternoonSlots] = useState<Date[]>([]);
  const [eveningSlots, setEveningSlots] = useState<Date[]>([]);
  const slots = useCalendarStore((state) => state.slots) || [];

  let currentIndex = -1;
  if (selectedSlot) {
    const selectedTime = selectedSlot.getTime();
    currentIndex = slots.findIndex((slot) => {
      const slotDate = new Date(slot.date);
      return Math.abs(slotDate.getTime() - selectedTime) < MS_IN_MINUTE;
    });
  }
  const [activeGroup, setActiveGroup] = useState<TimeOfDay>(TimeOfDay.Morning);

  useEffect(() => {
    if (!calendar || !selectedService) return;

    const serviceDuration = selectedService.durationMinutes;
    const availability = calendar[0]?.days[0]?.availability;
    if (!availability) {
      setMorningSlots([]);
      setAfternoonSlots([]);
      setEveningSlots([]);
      return;
    }
    const step = 15;
    const slotsArr: Date[] = [];
    const morningArr: Date[] = [];
    const afternoonArr: Date[] = [];
    const eveningArr: Date[] = [];

    function isOverlapping(slotStart: Date, slotDuration: number, other: (typeof slots)[0]) {
      if (!other) return false;
      const otherStart = new Date(other.date);
      const otherEnd = new Date(otherStart.getTime() + (other.duration || 15) * MS_IN_MINUTE);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * MS_IN_MINUTE);
      return slotStart < otherEnd && slotEnd > otherStart;
    }

    availability.forEach((period) => {
      const start = timeUtils.getMinutesInDay(period.start);
      const end = timeUtils.getMinutesInDay(period.end);

      if (end - start < serviceDuration) {
        return;
      }

      for (let time = start; time <= end - serviceDuration; time += step) {
        const slotDate = timeUtils.addMinutesToDate(new Date(calendarParams.rangeFromDate), time);

        const overlaps = slots.some(
          (slot, idx) => idx !== currentIndex && isOverlapping(slotDate, serviceDuration, slot),
        );
        if (overlaps) continue;
        slotsArr.push(slotDate);
        const hour = slotDate.getHours();
        if (hour < 12) {
          morningArr.push(slotDate);
        } else if (hour >= 12 && hour < 17) {
          afternoonArr.push(slotDate);
        } else {
          eveningArr.push(slotDate);
        }
      }
    });

    setMorningSlots(morningArr);
    setAfternoonSlots(afternoonArr);
    setEveningSlots(eveningArr);
  }, [calendar, selectedService, slots, currentIndex]);

  useEffect(() => {
    if (activeGroup === TimeOfDay.Morning && morningSlots.length === 0) {
      if (afternoonSlots.length > 0) {
        setActiveGroup(TimeOfDay.Afternoon);
      } else if (eveningSlots.length > 0) {
        setActiveGroup(TimeOfDay.Evening);
      }
    } else if (activeGroup === TimeOfDay.Afternoon && afternoonSlots.length === 0) {
      if (eveningSlots.length > 0) {
        setActiveGroup(TimeOfDay.Evening);
      } else if (morningSlots.length > 0) {
        setActiveGroup(TimeOfDay.Morning);
      }
    } else if (activeGroup === TimeOfDay.Evening && eveningSlots.length === 0) {
      if (afternoonSlots.length > 0) {
        setActiveGroup(TimeOfDay.Afternoon);
      } else if (morningSlots.length > 0) {
        setActiveGroup(TimeOfDay.Morning);
      }
    }
  }, [activeGroup, morningSlots, afternoonSlots, eveningSlots]);

  const onOptionSelect = (date: Date) => {
    setSelectedSlot(date);
    setStep(4);
  };

  return (
    <div className='flex-1 flex flex-col items-center pt-5'>
      <div className='flex gap-4 mb-6'>
        {Object.values(TimeOfDay).map((timeOfDay) => (
          <button
            key={timeOfDay}
            className={button({ active: activeGroup === timeOfDay })}
            onClick={() => setActiveGroup(timeOfDay)}
            disabled={
              (timeOfDay === TimeOfDay.Morning && morningSlots.length === 0) ||
              (timeOfDay === TimeOfDay.Afternoon && afternoonSlots.length === 0) ||
              (timeOfDay === TimeOfDay.Evening && eveningSlots.length === 0)
            }
          >
            {t(timeOfDay)}
          </button>
        ))}
      </div>
      <div className='gap-4 grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 w-full'>
        {activeGroup === TimeOfDay.Morning &&
          morningSlots.map((slot) => (
            <TimeSlotOption
              key={slot.toISOString()}
              date={slot}
              onChange={onOptionSelect}
              selectedSlot={selectedSlot}
              isTheSameDay={isTheSameDay}
            />
          ))}
        {activeGroup === TimeOfDay.Afternoon &&
          afternoonSlots.map((slot) => (
            <TimeSlotOption
              key={slot.toISOString()}
              date={slot}
              onChange={onOptionSelect}
              selectedSlot={selectedSlot}
              isTheSameDay={isTheSameDay}
            />
          ))}
        {activeGroup === TimeOfDay.Evening &&
          eveningSlots.map((slot) => (
            <TimeSlotOption
              key={slot.toISOString()}
              date={slot}
              onChange={onOptionSelect}
              selectedSlot={selectedSlot}
              isTheSameDay={isTheSameDay}
            />
          ))}
        {morningSlots.length === 0 && afternoonSlots.length === 0 && eveningSlots.length === 0 && (
          <div className='col-span-full text-center text-black py-6 md:max-w-[70%] mx-auto'>
            {t('noAvailableSlots')}
          </div>
        )}
      </div>
    </div>
  );
}
