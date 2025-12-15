import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing } from '@avoo/design-tokens';
import DefaultRightContent from './DefaultRightContent';
import DefaultLeftContent from './DefaultLeftContent';
import DefaultTitle from './DefaultTitle';

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
      return <DefaultTitle />;
    }

    if (typeof title === 'string') {
      return <Text style={styles.titleText}>{title}</Text>;
    }

    return title;
  };

  return (
    <View style={[styles.header, headerStyle]}>
      <View style={styles.headerLeft}>
        {leftContent ?? <DefaultLeftContent showBack={showBack} onBackPress={onBackPress} />}
      </View>

      <View style={[styles.titleContainer, titleStyle]}>{renderTitle()}</View>

      <View style={styles.headerRight}>{rightContent ?? <DefaultRightContent />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: 16,
  },
  headerLeft: {
    justifyContent: 'center',
  },
  headerRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
});
