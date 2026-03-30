import React from 'react';

import {
  Combination,
  GetPublicCalendarResponse,
  PublicCalendarQueryParams,
  Service,
} from '@avoo/axios/types/apiTypes';
import { timeUtils } from '@avoo/shared';

import PublicCalendar from '@/_components/PublicCalendar/PublicCalendar';
import PublicDateCard from '@/_components/PublicDateCard/PublicDateCard';
import PublicOrderTitle from '@/_components/PublicOrderTitle/PublicOrderTitle';
import TimeSlotField from '@/_components/TimeSlotField/TimeSlotField';

type Props = {
  ref: React.Ref<HTMLDivElement>;
  isActive: boolean;
  date?: string | null;
  onChange?: (newDate: string) => void;
  error?: string;
  selectedSlot: Date | null;
  setSelectedSlot: (date: Date | null) => void;
  selectedService: Service | Combination | null;
  userId: number;
  calendar: GetPublicCalendarResponse | null;
  calendarParams: PublicCalendarQueryParams;
  setStep: (step: number) => void;
};

export default function PublicDateTimeSelection(props: Props) {
  const {
    ref,
    isActive,
    date,
    onChange,
    error,
    selectedSlot,
    setSelectedSlot,
    selectedService,
    userId,
    calendar,
    calendarParams,
    setStep,
  } = props;

  return (
    <div ref={ref}>
      <PublicOrderTitle isActive={isActive} title='dateTime' />

      {isActive && (
        <div className='flex gap-6 mt-6'>
          <div className=' flex-1 max-w-120'>
            <PublicCalendar date={date} onChange={onChange} />
          </div>

          <TimeSlotField
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            selectedService={selectedService}
            calendar={calendar}
            calendarParams={calendarParams}
            userId={userId}
            isError={!!error && !selectedSlot}
            setStep={setStep}
            isTheSameDay={!!date && timeUtils.isSameDay(new Date(date), selectedSlot ?? new Date())}
          />
        </div>
      )}
      {!isActive && date && (
        <PublicDateCard
          date={date}
          duration={selectedService?.durationMinutes ?? 15}
          onClick={() => setStep(3)}
        />
      )}
    </div>
  );
}
