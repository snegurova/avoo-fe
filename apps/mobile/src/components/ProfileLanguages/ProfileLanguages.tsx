import { Text, View } from 'react-native';

import { LANGUAGE_NAMES, LanguageCode } from '@avoo/constants';
import { colors } from '@avoo/design-tokens';
import { masterHooks } from '@avoo/hooks';

import { Avatar } from '@/shared/Avatar/Avatar';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';

type Props = {
  languages: string[] | null;
};

const AVATAR_COLORS = [colors.primary[200], colors.blue[200], colors.orange[200]];

export const ProfileLanguages = ({ languages }: Props) => {
  const mastersData = masterHooks.useGetMastersProfileInfo({ limit: 100 });
  const masters = mastersData?.items ?? [];

  if (!languages || languages.length === 0) return null;

  return (
    <View>
      <SectionHeader title='Languages' />

      <View style={{ gap: 18 }}>
        {languages.map((code) => {
          const langName = LANGUAGE_NAMES[code as LanguageCode] ?? code;
          const label = `${langName} (${code.toUpperCase()})`;
          const langMasters = masters.filter((m) => m.languages && m.languages.includes(code));

          return (
            <View key={code}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  lineHeight: 24,
                  letterSpacing: 0.64,
                  color: '#2E3744',
                  marginBottom: 8,
                }}
              >
                {label}
              </Text>

              <View style={{ height: 1, backgroundColor: '#E8DEEE', marginBottom: 8 }} />

              {langMasters.length > 0 ? (
                <View className='flex-row'>
                  {langMasters.map((master, i) => (
                    <View
                      key={master.id}
                      style={{
                        marginLeft: i === 0 ? 0 : -8,
                        zIndex: langMasters.length - i,
                        borderRadius: 999,
                        borderWidth: 2,
                        borderColor: colors.white,
                      }}
                    >
                      <Avatar
                        uri={master.avatarPreviewUrl || master.avatarUrl}
                        name={master.name ?? master.email}
                        size={40}
                        backgroundColor={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                        textStyle={{ fontSize: 14, lineHeight: 16 }}
                      />
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ProfileLanguages;
