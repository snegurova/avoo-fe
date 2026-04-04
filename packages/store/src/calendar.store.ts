import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { CalendarSlot, timeUtils } from '@avoo/shared';

import { useHydrationStore } from './hydration.store';
import { createZustandStorage, getPlatformStorage } from './storage';

export type CalendarStore = {
  masterIds: number[] | undefined;
  statuses: OrderStatus[] | undefined;
  date: Date;
  toDate: Date;
  orderIsOutOfSchedule: boolean | undefined;
  type: CalendarViewType;
  slots: CalendarSlot[] | null;
  workingTimeOnly: boolean;
  setMasterIds: (masterIds: number[] | undefined) => void;
  setStatuses: (statuses: OrderStatus[] | undefined) => void;
  setDate: (date: Date) => void;
  setToDate: (toDate: Date) => void;
  setOrderIsOutOfSchedule: (orderIsOutOfSchedule: boolean | undefined) => void;
  setType: (type: CalendarViewType) => void;
  setWorkingTimeOnly: (workingTimeOnly: boolean) => void;
  setSlots: (slots: CalendarSlot[] | null) => void;
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
};

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      ...initialState,
      slots: null,
      setMasterIds: (masterIds) => set({ masterIds }),
      setStatuses: (statuses) => set({ statuses }),
      setDate: (date) => set({ date }),
      setToDate: (toDate) => set({ toDate }),
      setOrderIsOutOfSchedule: (orderIsOutOfSchedule) => set({ orderIsOutOfSchedule }),
      setType: (type) => set({ type }),
      setWorkingTimeOnly: (workingTimeOnly) => set({ workingTimeOnly }),
      setSlots: (slots) => set({ slots }),
      resetStorage: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: 'calendar-storage',
      storage: createZustandStorage<CalendarStore>(getPlatformStorage()),
      merge: (persistedState, currentState) => {
        const state = persistedState as CalendarStore;
        return {
          ...currentState,
          ...state,
          date: state.date ? new Date(state.date) : currentState.date,
          toDate: state.toDate ? new Date(state.toDate) : currentState.toDate,
        };
      },
      onRehydrateStorage: () => () => {
        useHydrationStore.getState().setHasHydrated(true);
      },
    },
  ),
);
