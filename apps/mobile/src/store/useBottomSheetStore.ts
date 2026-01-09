// shared/stores/useBottomSheetStore.ts
import { create } from 'zustand';
import { ComponentType } from 'react';

export type GlobalBottomSheetOptions = {
  snapPoints?: (string | number)[];
  enableDynamicSizing?: boolean;
  index?: number;
};

export enum BottomSheetType {
  CREATE_MASTER = 'create-master',
  PROFILE = 'profile',
}

export type BottomSheetTypeValue = BottomSheetType | null;

export type BottomSheetComponents = {
  [K in BottomSheetType]: ComponentType;
};

type BottomSheetState = {
  type: BottomSheetType | null;
  options: GlobalBottomSheetOptions | null;
  handleOpenBottomSheet: (type: BottomSheetType, options: GlobalBottomSheetOptions | null) => void;
  handleCloseBottomSheet: () => void;
};

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  type: null,
  options: null,
  handleOpenBottomSheet: (type, options) => set({ type, options }),
  handleCloseBottomSheet: () => set({ type: null, options: null }),
}));
