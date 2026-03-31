import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { colors } from '@avoo/design-tokens';

import { CONSTANTS } from '@/constants/constants';
import { MaterialIcons } from '@/shared/icons';
import { RootNavigationProp, RootScreens } from '@/types/navigation';

import { BottomBarItem } from './BottomBarItem';

export function BottomBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const rootNavigation = useNavigation<RootNavigationProp>();

  const handleNavigateToBooking = useCallback(() => {
    rootNavigation.navigate(RootScreens.AddBookingScreen);
  }, [rootNavigation]);

  return (
    <View pointerEvents='box-none' style={StyleSheet.absoluteFill}>
      <View
        className='absolute bg-white justify-center rounded-[24px] z-10'
        style={{
          left: CONSTANTS.BOTTOM_BAR.H_PADDING,
          right: CONSTANTS.BOTTOM_BAR.H_PADDING,
          bottom: CONSTANTS.BOTTOM_BAR.BOTTOM_OFFSET,
          height: CONSTANTS.BOTTOM_BAR.HEIGHT,
        }}
      >
        <View className='flex-row items-center justify-around'>
          {state.routes.map((route, index) => (
            <BottomBarItem
              key={route.key}
              route={route}
              descriptors={descriptors}
              currentIndex={state.index}
              index={index}
              navigation={navigation}
            />
          ))}
        </View>
        <Pressable
          className='absolute top-[-56px] right-0'
          hitSlop={20}
          onPress={handleNavigateToBooking}
        >
          <View className='w-11 h-11 rounded-full bg-primary-400 items-center justify-center'>
            <MaterialIcons name='add' size={24} color={colors.white} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
