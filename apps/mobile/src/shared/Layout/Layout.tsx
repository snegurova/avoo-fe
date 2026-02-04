import React from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '@/components/NavBar/NavBar';
import { layoutHooks } from '@/hooks/layoutHooks';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';

type Props = {
  children: React.ReactNode;
  isHeaderHidden?: boolean;
  title?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showBack?: boolean;
  onBackPress?: () => void;
  centerContent?: boolean;
  hasBottomTab?: boolean;
  isScrollableDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
};

export default function Layout(props: Props) {
  const {
    children,
    isHeaderHidden = false,
    title,
    leftContent,
    rightContent,
    showBack,
    onBackPress,
    centerContent = false,
    hasBottomTab = false,
    isScrollableDisabled = false,
    style,
    headerStyle,
  } = props;

  const bottomBarHeight = layoutHooks.useBottomBarHeight();

  return (
    <SafeAreaView
      edges={hasBottomTab ? ['top'] : undefined}
      className='flex-1 bg-primary-50'
      style={style}
    >
      {!isHeaderHidden && (
        <>
          <NavBar
            title={title}
            leftContent={leftContent}
            rightContent={rightContent}
            showBack={showBack}
            onBackPress={onBackPress}
            headerStyle={headerStyle}
          />
          <View className='mx-5 my-2 rounded-md p-2' style={styles.banner}>
            <Pressable
              className='absolute top-1 right-1 w-5 h-5 items-start justify-start'
            >
              <MaterialIcons name='close' size={16} color={colors.black} />
            </Pressable>
            <Text variant='bodyMedium' style={styles.bannerText}>
              Lorem ipsum. Sed egestas porttitor egestas mauris diam lorem....{' '}
              <Text variant='titleSmall' style={styles.bannerTextLink}>
                more.
              </Text>
            </Text>
          </View>
        </>
      )
      }
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {isScrollableDisabled ? (
          <View
            className="flex-1 px-5"
          >
            {children}
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-5 pt-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={hasBottomTab ? { paddingBottom: bottomBarHeight } : undefined}
            contentContainerClassName={centerContent ? 'flex-1 justify-center items-center' : undefined}
          >
            {children}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary[100],
  },
  bannerText: {
    color: colors.primary[800],
    paddingRight: 28,
    lineHeight: 16,
  },
  bannerTextLink: {
    color: colors.primary[800],
    textDecorationLine: 'underline',
    
  },
});