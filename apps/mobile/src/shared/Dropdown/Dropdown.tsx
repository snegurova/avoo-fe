import React, { useState, cloneElement } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, StyleProp, ViewStyle, PressableProps } from 'react-native';
import { colors, spacing, radius, typography } from '@avoo/design-tokens';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

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

export default function Dropdown(props: Props) {
  const {
    trigger,
    items,
    align = DropdownAlign.RIGHT,
    menuStyle,
    itemStyle,
    estimatedMenuWidth,
  } = props;

  const [visible, setVisible] = useState(false);

  const defaultMenuWidth = styles.menuContainer.minWidth || 0;
  const menuWidth = estimatedMenuWidth ?? defaultMenuWidth;

  const { triggerRef, menuPosition, handleMenuLayout, handleTriggerLayout, isPositionReady } =
    useDropdownPosition(
      visible,
      align === DropdownAlign.RIGHT ? 'right' : 'left',
      spacing.xs,
      menuWidth,
    );

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

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
      : () => openMenu(),
  });

  return (
    <>
      <View ref={triggerRef} onLayout={handleTriggerLayout}>
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
