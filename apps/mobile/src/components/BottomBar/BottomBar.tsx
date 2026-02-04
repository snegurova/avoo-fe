import { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { BottomBarItem } from './BottomBarItem';
import { colors } from '@avoo/design-tokens';
import { MaterialIcons } from '@/shared/icons';
import { RootScreens, RootNavigationProp } from '@/types/navigation';
import { Text } from 'react-native-paper';
import { CONSTANTS } from '@/constants/constants';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { utils } from '@avoo/hooks';

export function BottomBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const rootNavigation = useNavigation<RootNavigationProp>();

  const { value: visible, enable, disable } = utils.useBooleanState(false);

  const handleNavigateToPost = useCallback(() => {
    disable();
    rootNavigation.navigate(RootScreens.AddPostScreen);
  }, [rootNavigation, disable]);

  const handleNavigateToBooking = useCallback(() => {
    disable();
    rootNavigation.navigate(RootScreens.AddBookingScreen);
  }, [rootNavigation, disable]);

  return (
    <>
      <View pointerEvents='box-none' style={StyleSheet.absoluteFill}>
        <View
          className='absolute bg-white justify-center rounded-[24px] z-10'
          style={[
            {
              left: CONSTANTS.BOTTOM_BAR.H_PADDING,
              right: CONSTANTS.BOTTOM_BAR.H_PADDING,
              bottom: CONSTANTS.BOTTOM_BAR.BOTTOM_OFFSET,
              height: CONSTANTS.BOTTOM_BAR.HEIGHT,
            },
          ]}
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
            onPress={enable}
          >
            <View className='w-11 h-11 rounded-full bg-primary-400 items-center justify-center'>
              <MaterialIcons name='add' size={24} color={colors.white} />
            </View>
          </Pressable>
        </View>
        <CustomBottomSheet visible={visible} onClose={disable}>
          <Pressable className='px-6 py-4' onPress={handleNavigateToPost}>
            <Text variant='titleMedium'>New Post</Text>
          </Pressable>
          <Pressable className='px-6 py-4' onPress={handleNavigateToBooking}>
            <Text variant='titleMedium'>Add Booking</Text>
          </Pressable>
        </CustomBottomSheet>
      </View>
    </>
  );
}

