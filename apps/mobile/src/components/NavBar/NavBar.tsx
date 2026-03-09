import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { typeGuardHooks } from '@avoo/shared';

import DefaultLeftContent from './DefaultLeftContent';
import DefaultRightContent from './DefaultRightContent';

type Props = {
  title?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showBack?: boolean;
  onBackPress?: () => void;
  headerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
};

export default function NavBar(props: Props) {
  const { title, leftContent, rightContent, showBack, onBackPress, headerStyle, titleStyle } =
    props;

  const renderTitle = () => {
    if (title == null) {
      return null;
    }

    if (typeGuardHooks.isString(title)) {
      return <Text variant='titleMedium'>{title}</Text>;
    }

    return title;
  };

  return (
    <View className='h-14 flex-row items-center bg-primary-50 px-4' style={headerStyle}>
      <View className='justify-center'>
        {leftContent ?? <DefaultLeftContent showBack={showBack} onBackPress={onBackPress} />}
      </View>

      <View className='flex-1 items-end justify-center mr-lg' style={titleStyle}>
        {renderTitle()}
      </View>

      <View className='justify-center items-end'>{rightContent ?? <DefaultRightContent />}</View>
    </View>
  );
}
