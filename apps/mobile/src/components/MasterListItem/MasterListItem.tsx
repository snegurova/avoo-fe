import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/shared/Avatar/Avatar';
import { colors, typography, radius } from '@avoo/design-tokens';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { MasterLanguageList } from '@/components/MasterLanguageList/MasterLanguageList';

type Props = {
  master: MasterWithRelationsEntityResponse;
};

export const MasterListItem = ({ master }: Props) => {
  const displayName = master.name || 'No name';
  const languages = master.languages || [];
  const phone = master.phone || 'No phone';

  return (
    <View style={styles.container}>
      <Avatar
        backgroundColor={colors.primary[200]}
        size={40}
        uri={master.avatarPreviewUrl || master.avatarUrl}
        name={displayName}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{master.email}</Text>
        <Text style={styles.phone}>{phone}</Text>
        <MasterLanguageList languages={languages} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[700],
    marginBottom: 4,
  },
  email: {
    fontSize: typography.fontSize.sm,
    color: colors.black,
    marginBottom: 4,
  },
  phone: {
    fontSize: typography.fontSize.sm,
    color: colors.black,
    marginBottom: 4,
  },
});
