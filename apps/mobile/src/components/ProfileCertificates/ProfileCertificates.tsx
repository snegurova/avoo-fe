import { Image, Text, View } from 'react-native';

import { userHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';

export const ProfileCertificates = () => {
  const certificates = userHooks.useGetUserCertificates();
  const items = certificates?.items ?? [];

  return (
    <View>
      <SectionHeader title='Certificates' />

      {items.length === 0 ? (
        <View className='rounded-xl border border-gray-200 px-4 py-6'>
          <Text className='text-sm font-bold text-gray-900 text-center'>No certificates</Text>
          <Text className='text-xs text-gray-500 text-center mt-1'>
            Your certificates will appear here.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {items.map((cert) => (
            <View
              key={cert.id}
              className='bg-white rounded-xl overflow-hidden border border-gray-100'
            >
              {cert.previewUrl && typeof cert.previewUrl === 'string' ? (
                <Image
                  source={{ uri: cert.previewUrl as string }}
                  style={{ width: '100%', height: 180 }}
                  resizeMode='cover'
                />
              ) : null}
              <View className='p-3' style={{ gap: 4 }}>
                <Text className='text-sm font-medium text-slate-900'>{cert.title}</Text>
                {cert.issueDate ? (
                  <Text className='text-xs text-gray-500'>
                    {timeUtils.formatDateToIssuedDate(cert.issueDate)}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ProfileCertificates;
