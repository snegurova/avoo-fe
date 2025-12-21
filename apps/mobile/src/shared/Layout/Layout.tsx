import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '@/components/NavBar/NavBar';

type Props = {
  children: React.ReactNode;
  isHeaderHidden?: boolean;
  title?:  React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showBack?: boolean;
  onBackPress?: () => void;
  centerContent?: boolean;
  hasBottomTab?: boolean;
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
    style,
    headerStyle,
  } = props;

  return (
    <SafeAreaView
      edges={hasBottomTab ? ['top'] : undefined}
      className="flex-1 bg-primary-50"
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
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName={centerContent ? 'flex-1 justify-center items-center p-4' : undefined}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
