import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

/**
 * Props for the Layout component
 * @property {React.ReactNode} children - Content to be rendered inside the layout
 * @property {string | React.ReactNode} title - Header title or custom title component
 * @property {React.ReactNode} leftContent - Custom content for the left side of header
 * @property {React.ReactNode} rightContent - Custom content for the right side of header
 * @property {boolean} showBack - Whether to show back button (only shown if no leftContent)
 * @property {() => void} onBackPress - Custom back button handler if not using navigation.goBack()
 * @property {boolean} centerContent - Whether to center the main content vertically and horizontally
 * @property {boolean} hasBottomTab - Whether the screen has bottom tab navigation this is used to set the safe area edges
 */
type LayoutProps = {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showBack?: boolean;
  onBackPress?: () => void;
  centerContent?: boolean;
  hasBottomTab?: boolean;
};

/**
 * Layout component that provides consistent layout structure across the app
 * 
 * Features:
 * - Safe area handling
 * - Customizable header with title, left and right content
 * - Back button navigation
 * - Keyboard avoiding behavior
 * - Content centering option
 * - Bottom tab navigation support
 * 
 * Usage:
 * ```tsx
 * // Basic usage
 * <Layout title="Home">
 *   <YourContent />
 * </Layout>
 * 
 * // With custom header content
 * <Layout
 *   leftContent={<MenuButton />}
 *   title="Profile"
 *   rightContent={<SettingsButton />}
 * >
 *   <YourContent />
 * </Layout>
 * ```
 */
export const Layout = ({
  children,
  title,
  leftContent,
  rightContent,
  showBack,
  onBackPress,
  centerContent = false,
  hasBottomTab = false,
}: LayoutProps) => {
  // Get navigation instance for default back behavior
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView 
      edges={hasBottomTab ? ['top'] : undefined} 
      style={styles.container}
    >
      {/* Header - only rendered if there's title or header content */}
      {(title || leftContent || rightContent) && (
        <View style={styles.header}>
          {/* Left Section - shows custom content or back button */}
          <View style={styles.headerLeft}>
            {leftContent || (showBack && (
              <TouchableOpacity
                onPress={onBackPress || (() => navigation.goBack())}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Title Section - supports string or custom component */}
          {typeof title === 'string' ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <View style={styles.title}>
              {title}
            </View>
          )}

          {/* Right Section */}
          <View style={styles.headerRight}>
            {rightContent}
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={centerContent ? styles.centerContent : {}}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * Styles for Layout component
 * 
 * Structure:
 * - container: Main container with full screen height
 * - header: Top header bar with flexible content
 * - headerLeft/Right: Fixed width sections for consistent layout
 * - title: Center section with flexible width
 * - content: Main content area with optional centering
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56, // Standard header height
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  headerLeft: {
    width: 60, // Fixed width for consistent layout
    paddingLeft: 16,
    justifyContent: 'center',
  },
  headerRight: {
    width: 60, // Fixed width for consistent layout
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    flex: 1, // Takes remaining space between left/right
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 20,
    color: '#007AFF', // iOS blue color
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