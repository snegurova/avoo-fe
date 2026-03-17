import React, { useEffect, useMemo, useRef } from 'react';

import { timeUtils } from '@avoo/shared';
import { useCalendarStore } from '@avoo/store';

import CalendarSlot from '@/_components/CalendarSlot/CalendarSlot';

type Props = {
  masterId: number;
};

export default function CalendarSlots(props: Props) {
  const { masterId } = props;
  const slots = useCalendarStore((state) => state.slots);
  const date = useCalendarStore((state) => state.date);

  const filteredSlots = useMemo(() => {
    return slots?.filter(
      (slot) => slot.masterId === masterId && timeUtils.isSameDay(new Date(slot.date), date),
    );
  }, [slots, masterId, date]);

  const firstSlotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (filteredSlots && filteredSlots.length > 0 && firstSlotRef.current) {
      firstSlotRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [filteredSlots]);

  return (
    <>
      {filteredSlots?.map((slot, idx) => (
        <CalendarSlot
          key={'slot' + slot.index}
          {...slot}
          ref={idx === 0 ? firstSlotRef : undefined}
        />
      ))}
    </>
  );
}
