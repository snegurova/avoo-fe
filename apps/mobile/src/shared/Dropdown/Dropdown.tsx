import React, { useState, cloneElement, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  StyleProp,
  ViewStyle,
  PressableProps,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { colors, spacing, radius, typography } from '@avoo/design-tokens';

export enum DropdownAlign {
  LEFT = 'left',
  RIGHT = 'right',
}

export type MenuItem = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type Trigger =
  | React.ReactElement<PressableProps>
  | ((visible: boolean) => React.ReactElement<PressableProps>);

type Props = {
  trigger: Trigger;
  items: MenuItem[];
  align?: DropdownAlign;
  menuStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  estimatedMenuWidth?: number;
};

type Layout = { x: number; y: number; width: number; height: number };

function computeMenuPosition(
  triggerLayout: Layout,
  menuWidth: number,
  align: DropdownAlign,
  gap: number,
): ViewStyle {
  const screenWidth = Dimensions.get('window').width;
  const leftPosition = triggerLayout.x;
  const rightPosition = screenWidth - (triggerLayout.x + triggerLayout.width);

  const fitsOnLeft = leftPosition >= 0 && leftPosition + menuWidth <= screenWidth;
  const fitsOnRight =
    rightPosition >= 0 && triggerLayout.x + triggerLayout.width - menuWidth >= 0;

  let finalPosition: ViewStyle;
  if (align === DropdownAlign.RIGHT) {
    finalPosition =
      !fitsOnRight && fitsOnLeft ? { left: leftPosition } : { right: rightPosition };
  } else {
    finalPosition =
      !fitsOnLeft && fitsOnRight ? { right: rightPosition } : { left: leftPosition };
  }

  return {
    position: 'absolute',
    top: triggerLayout.y + triggerLayout.height + gap,
    ...finalPosition,
  };
}

function useDropdownPosition(
  isVisible: boolean,
  align: DropdownAlign,
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
  }, [triggerRef, setTriggerLayout]);

  const handleMenuLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      if (width > 0) {
        setMenuWidth(width);
      }
    },
    [setMenuWidth],
  );

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

  const currentPosition = useMemo(
    (): ViewStyle => {
      if (!isPositionReady || triggerLayout.width === 0) {
        return {
          position: 'absolute',
          top: 0,
          left: 0,
        };
      }

      return computeMenuPosition(triggerLayout, menuWidth, align, gap);
    },
    [isPositionReady, triggerLayout, menuWidth, align, gap],
  );

  useEffect(() => {
    if (isPositionReady && triggerLayout.width > 0 && isVisible) {
      setLastValidPosition(currentPosition);
    }
  }, [isPositionReady, triggerLayout.width, isVisible, currentPosition]);

  const menuPosition: ViewStyle =
    !isVisible && lastValidPosition ? lastValidPosition : currentPosition;

  return {
    triggerRef,
    menuPosition,
    handleMenuLayout,
    measureTrigger,
    isPositionReady,
  };
}

function useDropdownState() {
  const [visible, setVisible] = useState(false);

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  return {
    visible,
    openMenu,
    closeMenu,
  };
}

const hooks = {
  useDropdownPosition,
  useDropdownState,
};

export default function Dropdown(props: Props) {
  const {
    trigger,
    items,
    align = DropdownAlign.RIGHT,
    menuStyle,
    itemStyle,
    estimatedMenuWidth,
  } = props;

  const { visible, openMenu, closeMenu } = hooks.useDropdownState();

  const defaultMenuWidth = styles.menuContainer.minWidth || 0;
  const menuWidth = estimatedMenuWidth ?? defaultMenuWidth;

  const { triggerRef, menuPosition, handleMenuLayout, measureTrigger, isPositionReady } =
    hooks.useDropdownPosition(
      visible,
      align,
      spacing.xs,
      menuWidth,
    );

  if (!items || items.length === 0) {
    const triggerElement = typeof trigger === 'function' ? trigger(false) : trigger;
    return <>{triggerElement}</>;
  }

  const triggerElement = typeof trigger === 'function' ? trigger(visible) : trigger;
  const existingOnPress = triggerElement.props?.onPress;
  const triggerWithProps = cloneElement(triggerElement, {
    onPress: existingOnPress
      ? (event) => {
          existingOnPress(event);
          openMenu();
        }
      : openMenu,
  });

  return (
    <>
      <View ref={triggerRef} onLayout={measureTrigger}>
        {triggerWithProps}
      </View>
      <Modal visible={visible && isPositionReady} transparent onRequestClose={closeMenu}>
        <Pressable style={styles.modalOverlay} onPress={closeMenu}>
          <View style={[styles.menuContainer, menuPosition, menuStyle]} onLayout={handleMenuLayout}>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <Pressable
                  onPress={() => {
                    closeMenu();
                    item.onPress();
                  }}
                  style={[styles.menuItem, itemStyle, item.style]}
                >
                  {item.icon && <View style={styles.menuIcon}>{item.icon}</View>}
                  <Text style={styles.menuItemTitle}>{item.label}</Text>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    minWidth: 135,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'transparent',
  },
  menuIcon: {
    marginRight: spacing.sm,
  },
  menuItemTitle: {
    fontSize: typography.fontSize.md,
    color: colors.black,
    fontWeight: typography.fontWeight.regular,
  },
});
