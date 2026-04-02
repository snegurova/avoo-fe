import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';
import { userHooks } from '@avoo/hooks';

import { CallIcon, DistanceIcon, EditSquareIcon, MailIcon } from '@/icons';

import { EditProfileBottomSheet } from '../EditProfileBottomSheet/EditProfileBottomSheet';

export function ProfileInfo() {
  const { visualProfileInfo } = userHooks.useGetUserProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <View>
      <View className='flex-row items-center justify-between'>
        {visualProfileInfo.name ? (
          <Text className='text-2xl font-bold text-slate-900 mb-1 flex-1'>
            {visualProfileInfo.name}
          </Text>
        ) : null}
        <Pressable
          onPress={() => setIsEditOpen(true)}
          className='w-11 h-11 items-center justify-center'
        >
          <EditSquareIcon size={24} color={colors.gray[600]} />
        </Pressable>
      </View>

      {visualProfileInfo.headline ? (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 14,
            color: '#141A23',
            marginBottom: 24,
          }}
        >
          {visualProfileInfo.headline}
        </Text>
      ) : null}

      <View style={{ gap: 12 }}>
        <View className='flex-row items-center' style={{ gap: 12 }}>
          <DistanceIcon size={16} color={colors.gray[600]} />
          <Text className='text-sm text-slate-700 flex-1'>{visualProfileInfo.address || '—'}</Text>
        </View>
        <View className='flex-row items-center' style={{ gap: 12 }}>
          <MailIcon size={16} color={colors.gray[600]} />
          <Text className='text-sm text-slate-700'>{visualProfileInfo.email || '—'}</Text>
        </View>
        <View className='flex-row items-center' style={{ gap: 12 }}>
          <CallIcon size={16} color={colors.gray[600]} />
          <Text className='text-sm text-slate-700'>{visualProfileInfo.phone || '—'}</Text>
        </View>
      </View>

      <View style={{ paddingTop: 24 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            lineHeight: 24,
            color: '#4D5560',
            letterSpacing: 0.64,
            marginBottom: 8,
          }}
        >
          About
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '400', lineHeight: 16.8, color: '#4D5560' }}>
          {visualProfileInfo.description || '—'}
        </Text>
      </View>

      <EditProfileBottomSheet
        profileInfo={visualProfileInfo}
        visible={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </View>
  );
}

export default ProfileInfo;
