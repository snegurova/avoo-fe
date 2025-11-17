import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type Props = {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showBack?: boolean;
  onBackPress?: () => void;
  centerContent?: boolean;
  hasBottomTab?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Layout = (props: Props) => {
  const {
    children,
    title,
    leftContent,
    rightContent,
    showBack,
    onBackPress,
    centerContent = false,
    hasBottomTab = false,
    style,
  } = props;
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={hasBottomTab ? ['top'] : undefined} style={[styles.container, style]}>
      {(title || leftContent || rightContent) && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {leftContent ||
              (showBack && (
                <TouchableOpacity
                  onPress={onBackPress || (() => navigation.goBack())}
                  style={styles.backButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
              ))}
          </View>

          {typeof title === 'string' ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <View style={styles.title}>{title}</View>
          )}

          <View style={styles.headerRight}>{rightContent}</View>
        </View>
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
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  headerLeft: {
    width: 60,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  headerRight: {
    width: 60,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 20,
    color: '#007AFF',
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
