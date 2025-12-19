import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '@avoo/design-tokens';
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
        {isScrollableDisabled ? (
          <View style={styles.scrollView}>
            <View
              style={[
                styles.contentContainer,
                centerContent && styles.centerContent,
              ]}
            >
              {children}
            </View>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.contentContainer,
              centerContent && styles.centerContent,
            ]}
          >
            {children}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[50],
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: radius.xl,
    padding: 20,
    minHeight: '100%',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
