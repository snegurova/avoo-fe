import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@avoo/design-tokens';
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
      style={[styles.container, style]}
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
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={centerContent ? styles.centerContent : {}}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[50],
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
