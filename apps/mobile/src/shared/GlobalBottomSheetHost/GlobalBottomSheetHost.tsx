import CreateMasterForm from "@/components/CreateMasterForm";
import { useBottomSheetStore, BottomSheetType } from "../../store/useBottomSheetStore";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { ProfileMenu } from "@/shared/ProfileMenu/ProfileMenu";
import { colors } from '@avoo/design-tokens';
import { ComponentType } from 'react';

type BottomSheetComponents = {
  [K in BottomSheetType]: ComponentType;
};

const BOTTOM_SHEET_COMPONENTS: BottomSheetComponents = {
  [BottomSheetType.CREATE_MASTER]: CreateMasterForm,
  [BottomSheetType.PROFILE]: ProfileMenu,
};

export function GlobalBottomSheetHost() {
    const bottomSheetRef = useRef<BottomSheet | null>(null);
  
    const { type, options, handleCloseBottomSheet } = useBottomSheetStore();

    useEffect(() => {
      if (!bottomSheetRef.current) return;
  
      if (type) {
        if (options?.snapPoints) {
          bottomSheetRef.current.snapToIndex(options.index ?? 0);
        } else {
          bottomSheetRef.current.expand();
        }
      } else {
        bottomSheetRef.current.close();
      }
    }, [type, options]);
  
    const renderContent = () => {
      if (!type) return null;
      const Component = BOTTOM_SHEET_COMPONENTS[type];
      return Component ? <Component /> : null;
    };

    const finalIndex = options?.index ?? -1;
    const finalEnableDynamicSizing = options?.enableDynamicSizing ?? true;
    const snapPoints = options?.snapPoints;

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={finalIndex}
        snapPoints={snapPoints}
        enableDynamicSizing={snapPoints ? false : finalEnableDynamicSizing}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.white }}
        handleIndicatorStyle={{ backgroundColor: colors.gray[300] }}
        onClose={handleCloseBottomSheet}
      >
        <BottomSheetView>{renderContent()}</BottomSheetView>
      </BottomSheet>
    );
  }
  