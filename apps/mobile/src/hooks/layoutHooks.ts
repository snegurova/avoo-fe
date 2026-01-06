import { CONSTANTS } from '@/constants/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useKeyboardVisible } from './useKeyboardVisible';
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const layoutHooks = {
  useBottomBarHeight() {
    const insets = useSafeAreaInsets();
    const isKeyboardVisible = this.useKeyboardVisible();

    const bottomBarHeight = !isKeyboardVisible ? CONSTANTS.BOTTOM_BAR.HEIGHT + insets.bottom : 0;

    return bottomBarHeight;
  },
  useKeyboardVisible() {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyboardVisible(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardVisible(false);
      });
  
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);
  
    return isKeyboardVisible;
  },
};
