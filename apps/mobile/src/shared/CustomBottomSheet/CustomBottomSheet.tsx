import React, { useEffect } from 'react';
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { animationHooks } from '@/hooks/animationHooks';

type SnapPoint = number | `${number}%`;

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  disableSwipeToClose?: boolean;
  snapToContent?: boolean;
  snapPoint?: SnapPoint;
};

export const CustomBottomSheet = (props: Props) => {
  const {
    visible,
    onClose,
    children,
    disableSwipeToClose = false,
    snapToContent = false,
    snapPoint,
  } = props;

  const { bottom } = useSafeAreaInsets();
  const { translateY, backdropOpacity, open, close, panResponder } =
    animationHooks.useBottomSheetAnimation({
      onClose,
      disableSwipeToClose,
    });

  useEffect(() => {
    if (visible) {
      open();
    }
  }, [visible, open]);

  const heightStyle = snapToContent ? undefined : { height: snapPoint || '95%' };

  if (!visible) return null;

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill} pointerEvents='box-none'>
        <Animated.View
          className='absolute inset-0 bg-black/40'
          style={{ opacity: backdropOpacity }}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        <Animated.View
          className='absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl'
          style={[
            snapToContent && { maxHeight: '95%' },
            heightStyle,
            {
              transform: [{ translateY }],
              paddingBottom: bottom,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className={snapToContent ? 'flex-0' : 'flex-1'}
            pointerEvents='box-none'
          >
            <View className='w-10 h-1 rounded bg-gray-300 self-center my-3' />
            {children}
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Portal>
  );
};
