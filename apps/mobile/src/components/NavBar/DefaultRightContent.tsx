import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@/shared/icons';
import { Avatar } from '@/shared/Avatar/Avatar';
import { colors } from '@avoo/design-tokens';
import { userHooks } from '@avoo/hooks';

export default function DefaultRightContent() {
  const { visualProfileInfo } = userHooks.useGetUserProfile();

  return (
    <View style={styles.container}>
      <Pressable style={styles.iconButton}>
        <MaterialCommunityIcons name='share-variant-outline' size={24} />
      </Pressable>
      <Pressable style={styles.iconButton}>
        <MaterialIcons name='notifications-none' size={24} />
      </Pressable>
      <Pressable style={styles.iconButton}>
        <Avatar
          uri={visualProfileInfo?.avatarUrl || null}
          name={visualProfileInfo?.name || ''}
          size={40}
          backgroundColor={colors.primary[200]}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

