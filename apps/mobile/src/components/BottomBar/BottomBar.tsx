import { useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomBarItem } from './BottomBarItem';
import { useBottomBarStyles } from '@/hooks/useBottomBarStyles';
import { radius, colors } from '@avoo/design-tokens';
import { MaterialIcons } from '@/shared/icons';
import { RootScreens, RootNavigationProp } from '@/types/navigation';
import { Text } from 'react-native-paper';

export function BottomBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const { constants } = useBottomBarStyles();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const rootNavigation = useNavigation<RootNavigationProp>();

  const snapPoints = ['25%', '50%'];

  const handlePlusPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleNavigate = useCallback(
    (screen: RootScreens.AddPostScreen | RootScreens.AddBookingScreen) => {
      bottomSheetRef.current?.close();
      setTimeout(() => {
        rootNavigation.navigate(screen);
      }, 100);
    },
    [rootNavigation],
  );

  return (
    <>
      <View pointerEvents='box-none' style={StyleSheet.absoluteFill}>
        <View
          className='absolute bg-white justify-center rounded-[24px]'
          style={[
            styles.pill,
            {
              zIndex: 10,
              left: constants.H_PADDING,
              right: constants.H_PADDING,
              bottom: constants.BOTTOM_OFFSET,
              height: constants.HEIGHT,
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
          <Pressable className='absolute top-[-56px] right-0' hitSlop={20} onPress={handlePlusPress}>
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
          style={{ marginHorizontal: 20, zIndex: 1}}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.bottomSheetIndicator}
          bottomInset={constants.BOTTOM_OFFSET + constants.HEIGHT/2}
          onClose={handleClose}
          animateOnMount={false}
        >
          <BottomSheetView className='py-4'>
            <Pressable
              className='px-6 py-4'
              onPress={() => handleNavigate(RootScreens.AddPostScreen)}
            >
              <Text variant='titleMedium'>New Post</Text>
            </Pressable>
            <Pressable
              className='px-6 py-4'
              onPress={() => handleNavigate(RootScreens.AddBookingScreen)}
            >
              <Text variant='titleMedium'>Add Booking</Text>
            </Pressable>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  pill: {
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    // Android
    elevation: 8,
  },
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderRadius: radius['2xl'],
  },
  bottomSheetIndicator: {
    backgroundColor: colors.gray[300],
    width: 40,
  },
});
