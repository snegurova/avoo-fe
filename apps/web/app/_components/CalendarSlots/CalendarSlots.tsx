import React, { useMemo } from 'react';

import { useCalendarStore } from '@avoo/store';

import CalendarSlot from '@/_components/CalendarSlot/CalendarSlot';

type Props = {
  masterId: number;
};

export default function CalendarSlots(props: Props) {
  const { masterId } = props;
  const slots = useCalendarStore((state) => state.slots);

  const filteredSlots = useMemo(() => {
    return slots?.filter((slot) => slot.masterId === masterId);
  }, [slots, masterId]);

  return (
    <>
      {filteredSlots?.map((slot) => (
        <CalendarSlot key={'slot' + slot.index} {...slot} />
      ))}{' '}
    </>
  );
}
