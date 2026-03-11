import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { useHydrationStore } from './hydration.store';
import { createZustandStorage, getPlatformStorage } from './storage';

export type CalendarStore = {
  masterIds: number[] | undefined;
  statuses: OrderStatus[] | undefined;
  date: Date;
  toDate: Date;
  orderIsOutOfSchedule: boolean | undefined;
  type: CalendarViewType;
  setMasterIds: (masterIds: number[] | undefined) => void;
  setStatuses: (statuses: OrderStatus[] | undefined) => void;
  setDate: (date: Date) => void;
  setToDate: (toDate: Date) => void;
  setOrderIsOutOfSchedule: (orderIsOutOfSchedule: boolean | undefined) => void;
  setType: (type: CalendarViewType) => void;
};

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      masterIds: undefined,
      statuses: undefined,
      date: timeUtils.toDayBegin(new Date()),
      toDate: timeUtils.toDayEnd(new Date()),
      orderIsOutOfSchedule: undefined,
      type: CalendarViewType.DAY,
      setMasterIds: (masterIds) => set({ masterIds }),
      setStatuses: (statuses) => set({ statuses }),
      setDate: (date) => set({ date }),
      setToDate: (toDate) => set({ toDate }),
      setOrderIsOutOfSchedule: (orderIsOutOfSchedule) => set({ orderIsOutOfSchedule }),
      setType: (type) => set({ type }),
    }),
    {
      name: 'calendar-storage',
      storage: createZustandStorage<CalendarStore>(getPlatformStorage()),
      onRehydrateStorage: () => () => {
        useHydrationStore.getState().setHasHydrated(true);
      },
    },
  ),
);
