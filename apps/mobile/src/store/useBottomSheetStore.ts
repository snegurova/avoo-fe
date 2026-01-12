// shared/stores/useBottomSheetStore.ts
import { create } from 'zustand';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

export type GlobalBottomSheetOptions = {
  snapPoints?: (string | number)[];
  enableDynamicSizing?: boolean;
  index?: number;
};

export enum BottomSheetType {
  CREATE_MASTER = 'create-master',
  PROFILE = 'profile',
}

export type EditMasterProps = {
  master: MasterWithRelationsEntityResponse;
};

type BottomSheetStore = {
  type: BottomSheetType | null;
  options: GlobalBottomSheetOptions | null;
  handleOpenBottomSheet: (type: BottomSheetType, options?: GlobalBottomSheetOptions | null) => void;
  handleCloseBottomSheet: () => void;
};

export const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  type: null,
  options: null,
  handleOpenBottomSheet: (type, options) => set({ type, options: options ?? null }),
  handleCloseBottomSheet: () => set({ type: null, options: null }),
}));
