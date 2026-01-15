import { View, Pressable, StyleSheet } from 'react-native';
import { Avatar } from '@/shared/Avatar/Avatar';
import { colors } from '@avoo/design-tokens';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { MasterLanguageList } from '@/components/MasterLanguageList/MasterLanguageList';
import { Text } from 'react-native-paper';

type Props = {
  master: MasterWithRelationsEntityResponse;
  onPress?: (master: MasterWithRelationsEntityResponse) => void;
};

export const MasterListItem = ({ master, onPress }: Props) => {
  const languages = master.languages || [];

  const handlePress = () => {
    onPress?.(master);
  };

  return (
    <Pressable
      className='flex-col items-start bg-white rounded-md p-4 border border-gray-200'
      onPress={handlePress}
    >
      <View
        className='flex-row gap-4'
        style={languages.length > 0 ? { alignItems: 'flex-start' } : { alignItems: 'center' }}
      >
        <Avatar
          backgroundColor={colors.primary[200]}
          size={50}
          uri={master.avatarPreviewUrl || master.avatarUrl}
          name={master.name}
        />
        <View className='flex-1'>
          <Text variant='titleMedium' className='mb-2' style={styles.titleMedium}>
            {master.name}
          </Text>
          <Text
            variant='bodyMedium'
              style={[styles.bodyMedium, master.phone ? { marginBottom: 8 } : null]}
            >
            {master.email}
          </Text>
          {master.phone && (
            <Text variant='bodyMedium' style={styles.bodyMedium}>
              {master.phone}
            </Text>
          )}
          {languages.length > 0 && (
            <>
              <View className='h-[1px] bg-primary-100 my-3' />
              <View className='pl-1 w-full'>
                <MasterLanguageList languages={languages} />
              </View>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  titleMedium: {
    color: colors.gray[700],
  },
  bodyMedium: {
    color: colors.gray[500],
  },
});