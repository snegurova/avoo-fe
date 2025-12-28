import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import Layout from '@/shared/Layout/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';
import { masterHooks } from '@avoo/hooks';
import { MasterListItem } from '@/components/MasterListItem/MasterListItem';
import { SearchInput } from '@/shared/SearchInput/SearchInput';
import { MaterialIcons } from '@/shared/icons';
import { colors, typography, radius } from '@avoo/design-tokens';

type Props = RootStackScreenProps<RootScreens.MastersScreen>;

export default function MastersScreen(props: Props) {
  const { navigation } = props;

  const [searchQuery, setSearchQuery] = useState('');

  const masters = masterHooks.useGetMastersProfileInfo();
  const filteredMasters = masterHooks.useFilterMasters(masters, searchQuery);

  const handleNewMaster = () => {
    navigation.navigate(RootScreens.AddMasterScreen);
  };

  return (
    <Layout isScrollableDisabled={true}>
      <View style={styles.header}>
        <Text style={styles.title}>Masters</Text>
        <Pressable style={styles.newMasterButton} onPress={handleNewMaster}>
          <Text style={styles.newMasterText}>New master</Text>
          <MaterialIcons name='add' size={24} color={colors.black} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
        <FlatList
          data={filteredMasters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MasterListItem master={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No masters found' : 'No masters yet'}
              </Text>
            </View>
          }
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 30,
    letterSpacing: 0.04,
    color: colors.black,
  },
  content: {
    flex: 1,
  },
  newMasterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
  },
  newMasterText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 20,
    color: colors.black,
  },
  listContainer: {
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.gray[500],
  },
});
