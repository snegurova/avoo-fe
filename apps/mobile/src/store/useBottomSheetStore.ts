// shared/stores/useBottomSheetStore.ts
import { create } from 'zustand';
import { ComponentType } from 'react';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

export type GlobalBottomSheetOptions = {
  snapPoints?: (string | number)[];
  enableDynamicSizing?: boolean;
  index?: number;
};

export enum BottomSheetType {
  CREATE_MASTER = 'create-master',
  EDIT_MASTER = 'edit-master',
  PROFILE = 'profile',
}


export type CreateMasterProps = Record<string, never>; 

export type EditMasterProps = {
  master: MasterWithRelationsEntityResponse;
};

export type ProfileProps = Record<string, never>;

export type BottomSheetPropsMap = {
  [BottomSheetType.CREATE_MASTER]: CreateMasterProps;
  [BottomSheetType.EDIT_MASTER]: EditMasterProps;
  [BottomSheetType.PROFILE]: ProfileProps;
};

export type BottomSheetComponents = {
  [K in BottomSheetType]: ComponentType<Partial<BottomSheetPropsMap[K]>>;
};

type BottomSheetState =
  | {
      type: BottomSheetType.CREATE_MASTER;
      options: GlobalBottomSheetOptions | null;
      props: CreateMasterProps;
    }
  | {
      type: BottomSheetType.EDIT_MASTER;
      options: GlobalBottomSheetOptions | null;
      props: EditMasterProps;
    }
  | {
      type: BottomSheetType.PROFILE;
      options: GlobalBottomSheetOptions | null;
      props: ProfileProps;
    }
  | {
      type: null;
      options: null;
      props: null;
    };

type BottomSheetStore = BottomSheetState & {
  handleOpenBottomSheet: <K extends BottomSheetType>(
    type: K,
    options?: GlobalBottomSheetOptions | null,
    props?: BottomSheetPropsMap[K],
  ) => void;
  handleCloseBottomSheet: () => void;
};

export const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  type: null,
  options: null,
  props: null,

  handleOpenBottomSheet: (type, options, props) =>
    set({ type, options: options ?? null, props: props ?? null } as BottomSheetState),

  handleCloseBottomSheet: () =>
    set({ type: null, options: null, props: null }),
}));
