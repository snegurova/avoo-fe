import React, { useMemo } from 'react';

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

  return (
    <>
      {filteredSlots?.map((slot) => (
        <CalendarSlot key={'slot' + slot.index} {...slot} />
      ))}{' '}
    </>
  );
}
