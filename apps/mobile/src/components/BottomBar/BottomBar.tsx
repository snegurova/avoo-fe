import { useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomBarItem } from './BottomBarItem';
import { radius, colors } from '@avoo/design-tokens';
import { MaterialIcons } from '@/shared/icons';
import { RootScreens, RootNavigationProp } from '@/types/navigation';
import { Text } from 'react-native-paper';
import { CONSTANTS } from '@/constants/constants';

export function BottomBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const rootNavigation = useNavigation<RootNavigationProp>();

  const snapPoints = ['25%', '50%'];


  const handleNavigateToPost = useCallback(() => {
    bottomSheetRef.current?.close();
    rootNavigation.navigate(RootScreens.AddPostScreen);
  }, [rootNavigation]);

  const handleNavigateToBooking = useCallback(() => {
    bottomSheetRef.current?.close();
    rootNavigation.navigate(RootScreens.AddBookingScreen);
  }, [rootNavigation]);

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
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <View className='w-11 h-11 rounded-full bg-primary-400 items-center justify-center'>
              <MaterialIcons name='add' size={24} color={colors.white} />
            </View>
          </Pressable>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          style={{ marginHorizontal: 20, zIndex: 1 }}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.bottomSheetIndicator}
          bottomInset={CONSTANTS.BOTTOM_BAR.BOTTOM_OFFSET + CONSTANTS.BOTTOM_BAR.HEIGHT / 2}
          animateOnMount={false}
        >
          <BottomSheetView className='py-4'>
            <Pressable className='px-6 py-4' onPress={handleNavigateToPost}>
              <Text variant='titleMedium'>New Post</Text>
            </Pressable>
            <Pressable className='px-6 py-4' onPress={handleNavigateToBooking}>
              <Text variant='titleMedium'>Add Booking</Text>
            </Pressable>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
  },
  bottomSheetIndicator: {
    backgroundColor: colors.gray[300],
    width: 40,
  },
});
