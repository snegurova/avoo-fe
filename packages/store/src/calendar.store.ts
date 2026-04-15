import { create } from 'zustand';

import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { CalendarSlot, timeUtils } from '@avoo/shared';

export type CalendarStore = {
  masterIds: number[] | undefined;
  statuses: OrderStatus[] | undefined;
  date: Date;
  toDate: Date;
  orderIsOutOfSchedule: boolean | undefined;
  type: CalendarViewType;
  slots: CalendarSlot[] | null;
  workingTimeOnly: boolean;
  scrollToTimeValue: string | null;
  setMasterIds: (masterIds: number[] | undefined) => void;
  setStatuses: (statuses: OrderStatus[] | undefined) => void;
  setDate: (date: Date) => void;
  setToDate: (toDate: Date) => void;
  setOrderIsOutOfSchedule: (orderIsOutOfSchedule: boolean | undefined) => void;
  setType: (type: CalendarViewType) => void;
  setWorkingTimeOnly: (workingTimeOnly: boolean) => void;
  setSlots: (slots: CalendarSlot[] | null) => void;
  triggerScrollToTime: (dateTime: string) => void;
  resetStorage: () => void;
};

const initialState = {
  masterIds: undefined,
  statuses: undefined,
  date: timeUtils.toDayBegin(new Date()),
  toDate: timeUtils.toDayEnd(new Date()),
  orderIsOutOfSchedule: undefined,
  type: CalendarViewType.DAY,
  workingTimeOnly: true,
  scrollToTimeValue: null,
};

export const useCalendarStore = create<CalendarStore>()(
  (set: (partial: Partial<CalendarStore>) => void): CalendarStore => ({
    ...initialState,
    slots: null,
    setMasterIds: (masterIds: number[] | undefined) => set({ masterIds }),
    setStatuses: (statuses: OrderStatus[] | undefined) => set({ statuses }),
    setDate: (date: Date) => set({ date }),
    setToDate: (toDate: Date) => set({ toDate }),
    setOrderIsOutOfSchedule: (orderIsOutOfSchedule: boolean | undefined) =>
      set({ orderIsOutOfSchedule }),
    setType: (type: CalendarViewType) => set({ type }),
    setWorkingTimeOnly: (workingTimeOnly: boolean) => set({ workingTimeOnly }),
    setSlots: (slots: CalendarSlot[] | null) => set({ slots }),
    triggerScrollToTime: (dateTime: string) => set({ scrollToTimeValue: dateTime }),
    resetStorage: () =>
      set({
        ...initialState,
      }),
  }),
);
