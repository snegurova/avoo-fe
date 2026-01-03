import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardVisible } from './useKeyboardVisible';

// Константы для bottom bar
export const BOTTOM_BAR_CONSTANTS = {
  H_PADDING: 20,
  V_PADDING: 12,
  BOTTOM_OFFSET: 20,
  HEIGHT: 68,
} as const;

export function useBottomBarStyles() {
  const insets = useSafeAreaInsets();
  const isKeyboardVisible = useKeyboardVisible();

  const totalHeight = !isKeyboardVisible ? BOTTOM_BAR_CONSTANTS.HEIGHT + insets.bottom : 0;

  return {
    constants: BOTTOM_BAR_CONSTANTS,
    totalHeight,
    insetsBottom: insets.bottom,
    isKeyboardVisible,
  };
}
