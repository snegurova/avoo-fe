import { Pressable } from 'react-native';
import { BottomTabBarProps, BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import type { NavigationHelpers, ParamListBase, Route } from '@react-navigation/native';
import { colors } from '@avoo/design-tokens';
import { typeGuardHooks } from '@avoo/shared';
import { Text } from 'react-native-paper';

type Props = {
  route: Route<string, object | undefined>;
  descriptors: BottomTabBarProps['descriptors'];
  currentIndex: number;
  index: number;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};

export function BottomBarItem(props: Props) {
  const { route, descriptors, currentIndex, index, navigation } = props;

  const descriptor = descriptors[route.key];
  const focused = currentIndex === index;
  const options = descriptor.options;

  const label = typeGuardHooks.isString(options.tabBarLabel)
    ? options.tabBarLabel
    : typeGuardHooks.isString(options.title)
      ? options.title
      : route.name;

  const color = focused ? colors.primary[500] : colors.gray[600];

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='button'
      accessibilityState={focused ? { selected: true } : {}}
      className='flex-1 items-center justify-center gap-1'
      hitSlop={8}
    >
      {options.tabBarIcon ? options.tabBarIcon({ focused, color, size: 24 }) : null}
      <Text numberOfLines={1} variant='labelSmall' style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
}
