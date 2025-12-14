import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LayoutChangeEvent, ViewStyle, Dimensions, View } from 'react-native';
import { spacing } from '@avoo/design-tokens';

type Layout = { x: number; y: number; width: number; height: number };

export function useDropdownPosition(
  isVisible: boolean,
  align: 'left' | 'right',
  gap: number = spacing.xs,
  estimatedMenuWidth?: number
) {
  const [triggerLayout, setTriggerLayout] = useState<Layout>({ x: 0, y: 0, width: 0, height: 0 });
  const [menuWidth, setMenuWidth] = useState(estimatedMenuWidth || 0);
  const [isPositionReady, setIsPositionReady] = useState(false);
  const [lastValidPosition, setLastValidPosition] = useState<ViewStyle | null>(null);
  const triggerRef = useRef<View>(null);

  const measureTrigger = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setTriggerLayout({ x, y, width, height });
      });
    }
  }, []);

  const handleMenuLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setMenuWidth(width);
    }
  }, []);

  const handleTriggerLayout = useCallback(() => {
    measureTrigger();
  }, [measureTrigger]);

  useEffect(() => {
    if (isVisible) {
      setIsPositionReady(false);
      requestAnimationFrame(() => {
        measureTrigger();
        requestAnimationFrame(() => {
          setIsPositionReady(true);
        });
      });
    } else {
      setIsPositionReady(false);
    }
  }, [isVisible, measureTrigger]);

  const currentPosition = useMemo((): ViewStyle => {
    if (!isPositionReady || triggerLayout.width === 0) {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
      };
    }

    const screenWidth = Dimensions.get('window').width;
    const leftPosition = triggerLayout.x;
    const rightPosition = screenWidth - (triggerLayout.x + triggerLayout.width);
    
    const fitsOnLeft = leftPosition >= 0 && leftPosition + menuWidth <= screenWidth;
    const fitsOnRight = rightPosition >= 0 && (triggerLayout.x + triggerLayout.width) - menuWidth >= 0;
    
    let finalPosition: ViewStyle;
    if (align === 'right') {
      finalPosition = (!fitsOnRight && fitsOnLeft) 
        ? { left: leftPosition }
        : { right: rightPosition };
    } else {
      finalPosition = (!fitsOnLeft && fitsOnRight)
        ? { right: rightPosition }
        : { left: leftPosition };
    }
    
    return {
      position: 'absolute',
      top: triggerLayout.y + triggerLayout.height + gap,
      ...finalPosition,
    };
  }, [isPositionReady, triggerLayout, menuWidth, align, gap]);

  useEffect(() => {
    if (isPositionReady && triggerLayout.width > 0 && isVisible) {
      setLastValidPosition(currentPosition);
    }
  }, [isPositionReady, triggerLayout.width, isVisible, currentPosition]);

  const menuPosition: ViewStyle = !isVisible && lastValidPosition 
    ? lastValidPosition 
    : currentPosition;

  return {
    triggerRef,
    menuPosition,
    handleMenuLayout,
    handleTriggerLayout,
    isPositionReady,
  };
}
