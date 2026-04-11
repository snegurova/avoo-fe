import { useState } from 'react';
import { View } from 'react-native';

import { FILE_UPLOAD_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { filesHooks, userHooks } from '@avoo/hooks';

import AvatarUpload from '@/components/Avatar/AvatarUpload';
import { ProfileCertificates } from '@/components/ProfileCertificates/ProfileCertificates';
import { ProfileGallery } from '@/components/ProfileGallery/ProfileGallery';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import { ProfileLanguages } from '@/components/ProfileLanguages/ProfileLanguages';
import Layout from '@/shared/Layout/Layout';

export const ProfileScreen = () => {
  const { visualProfileInfo, visualLanguages } = userHooks.useGetUserProfile();
  const { handleUpdateProfileAvatar } = userHooks.useUpdateProfileAvatar();
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = filesHooks.useUploadFile({
    onSuccess: (fileData) => {
      handleUpdateProfileAvatar({ url: fileData.url, previewUrl: fileData.previewUrl });
      setIsUploading(false);
    },
    onError: () => setIsUploading(false),
  });

  return (
    <Layout showBack>
      <View style={{ gap: 32 }}>
        <View className='items-center'>
          <View
            style={{
              borderRadius: 9999,
              backgroundColor: '#F8FAFC',
              padding: 4,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <AvatarUpload
              size={112}
              iconSize={56}
              editIconSize={28}
              imageUri={visualProfileInfo.avatarUrl}
              isUploading={isUploading}
              onImageSelected={(file) => {
                setIsUploading(true);
                uploadFile({ type: FILE_UPLOAD_TYPE_ENUM.AVATAR, file });
              }}
            />
          </View>
        </View>
        <View className='bg-white rounded-2xl p-5 border border-gray-200'>
          <ProfileInfo />
        </View>
        {visualLanguages && visualLanguages.length > 0 && (
          <View className='bg-white rounded-2xl p-5 border border-gray-200'>
            <ProfileLanguages languages={visualLanguages} />
          </View>
        )}
        <View className='bg-white rounded-2xl p-5 border border-gray-200'>
          <ProfileGallery />
        </View>
        <View className='bg-white rounded-2xl p-5 border border-gray-200'>
          <ProfileCertificates />
        </View>
      </View>
    </Layout>
  );
};

export default ProfileScreen;
