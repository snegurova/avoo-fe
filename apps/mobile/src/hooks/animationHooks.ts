import { useRef, useCallback } from 'react';
import { Animated, Easing, PanResponder } from 'react-native';

type UseBottomSheetAnimationProps = {
  onClose: () => void;
  disableSwipeToClose?: boolean;
};

export const animationHooks = {
  useBottomSheetAnimation({ onClose, disableSwipeToClose = false }: UseBottomSheetAnimationProps) {
    const translateY = useRef(new Animated.Value(400)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    const open = useCallback(() => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 140,
          useNativeDriver: true,
        }),
      ]).start();
    }, [translateY, backdropOpacity]);

    const close = useCallback(() => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 400,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
      });
    }, [translateY, backdropOpacity, onClose]);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disableSwipeToClose,
        onMoveShouldSetPanResponder: (_, g) => !disableSwipeToClose && g.dy > 8,
        onPanResponderMove: (_, g) => {
          if (g.dy > 0) {
            translateY.setValue(g.dy);
          }
        },
        onPanResponderRelease: (_, g) => {
          if (!disableSwipeToClose && g.dy > 120) {
            close();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    ).current;

    return {
      translateY,
      backdropOpacity,
      open,
      close,
      panResponder,
    };
  },
};
