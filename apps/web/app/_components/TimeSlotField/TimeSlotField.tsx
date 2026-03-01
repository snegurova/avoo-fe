import React, { useState, useEffect } from 'react';
import {
  Service,
  Combination,
  PublicCalendarQueryParams,
  GetPublicCalendarResponse,
} from '@avoo/axios/types/apiTypes';
import TimeSlotOption from '../TimeSlotOption/TimeSlotOption';
import { timeUtils } from '@avoo/shared';

type Props = {
  selectedSlot: Date | null;
  setSelectedSlot: (date: Date | null) => void;
  selectedService: Service | Combination | null;
  userId: number;
  calendar: GetPublicCalendarResponse | null;
  calendarParams: PublicCalendarQueryParams;
  isError: boolean;
};

export default function TimeSlotField(props: Props) {
  const { selectedSlot, setSelectedSlot, selectedService, calendar, calendarParams, isError } =
    props;
  const [slots, setSlots] = useState<Date[]>([]);

  useEffect(() => {
    if (!calendar || !selectedService) return;

    const serviceDuration = selectedService.durationMinutes;
    const availability = calendar[0]?.days[0]?.availability;
    if (!availability) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }
    const step = 15;
    const slotsArr: Date[] = [];

    availability.forEach((period) => {
      const start = timeUtils.getMinutesInDay(period.start);
      const end = timeUtils.getMinutesInDay(period.end);

      if (end - start < serviceDuration) {
        return;
      }

      for (let time = start; time <= end - serviceDuration; time += step) {
        slotsArr.push(timeUtils.addMinutesToDate(new Date(calendarParams.rangeFromDate), time));
      }
    });

    setSlots(slotsArr);
    setSelectedSlot(null);
  }, [calendar, selectedService]);

  return (
    <div className='row-span-2'>
      {slots.length > 0 && (
        <>
          <label className='block mb-2 font-medium'>Time slot</label>
          <div className='gap-2 grid grid-cols-4'>
            {slots.map((slot) => (
              <TimeSlotOption
                key={slot.toISOString()}
                date={slot}
                onChange={setSelectedSlot}
                selectedSlot={selectedSlot}
              />
            ))}
          </div>
          {isError && (
            <div className='mt-1 text-sm text-red-500 col-span-3'>
              Please select a valid time slot
            </div>
          )}
        </>
      )}
    </div>
  );
}
