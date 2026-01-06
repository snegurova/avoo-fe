import React, { forwardRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '@avoo/design-tokens';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
  content: React.ReactNode;
  onClose: () => void;
  index?: number;
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean;
  backgroundStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const GlobalBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const {
    content,
    onClose,
    index = -1,
    enableDynamicSizing = true,
    enablePanDownToClose = true,
    backgroundStyle = { backgroundColor: colors.white },
    handleIndicatorStyle = { backgroundColor: colors.gray[300] },
    contentContainerStyle,
  } = props;
  return (
    <BottomSheet
      ref={ref}
      index={index}
      enableDynamicSizing={enableDynamicSizing}
      enablePanDownToClose={enablePanDownToClose}
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
      onClose={onClose}
    >
      <BottomSheetView style={contentContainerStyle}>{content}</BottomSheetView>
    </BottomSheet>
  );
});

GlobalBottomSheet.displayName = 'GlobalBottomSheet';

