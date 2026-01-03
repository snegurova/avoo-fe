import React from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '@/components/NavBar/NavBar';
import { useBottomBarStyles } from '@/hooks/useBottomBarStyles';

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

  const { totalHeight } = useBottomBarStyles();

  return (
    <SafeAreaView
      edges={hasBottomTab ? ['top'] : undefined}
      className='flex-1 bg-primary-50'
      style={style}
    >
      {!isHeaderHidden && (
        <NavBar
          title={title}
          leftContent={leftContent}
          rightContent={rightContent}
          showBack={showBack}
          onBackPress={onBackPress}
          headerStyle={headerStyle}
        />
      )}
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
            contentContainerStyle={hasBottomTab ? { paddingBottom: totalHeight } : undefined}
            contentContainerClassName={centerContent ? 'flex-1 justify-center items-center' : undefined}
          >
            {children}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
