import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import Layout from '@/shared/Layout/Layout';
import { masterHooks } from '@avoo/hooks';
import { MasterListItem } from '@/components/MasterListItem/MasterListItem';
import { SearchInput } from '@/shared/SearchInput/SearchInput';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import CreateMasterForm from '@/components/CreateMasterForm';
import { useGlobalBottomSheet } from '@/shared/GlobalBottomSheetProvider/GlobalBottomSheetProvider';
import { layoutHooks } from '@/hooks/layoutHooks';

export default function MastersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { handleOpenBottomSheet } = useGlobalBottomSheet();
  const bottomBarHeight = layoutHooks.useBottomBarHeight();

  const masters = masterHooks.useGetMastersProfileInfo();
  const filteredMasters = masterHooks.useFilterMasters(masters, searchQuery);

  const { control, handleSubmit, errors, isPending } = masterHooks.useCreateMasterForm({
    onSuccess: () => close(),
  });



  const handleOpenForm = () => {
    handleOpenBottomSheet(
      <CreateMasterForm
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        isPending={isPending}
      />,
    );
  };

  return (
    <Layout isScrollableDisabled={true} hasBottomTab={true}>
      <View className='flex-row justify-between items-center mb-4'>
        <Text className='text-xl font-medium text-black' style={styles.title}>
          Masters
        </Text>
        <Pressable
          className='flex-row items-center border border-black rounded-md px-4 py-3.5 gap-4'
          onPress={handleOpenForm}
        >
          <Text className='text-base font-medium text-black' style={styles.newMasterText}>
            New master
          </Text>
          <MaterialIcons name='add' size={24} color={colors.black} />
        </Pressable>
      </View>
      <View className='flex-1'>
        <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
        <FlatList
          data={filteredMasters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MasterListItem master={item} />}
          contentContainerStyle={{ gap: 12, paddingBottom: bottomBarHeight }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className='flex-1 justify-center items-center'>
              <Text className='text-base text-gray-500'>
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
  title: {
    lineHeight: 30,
    letterSpacing: 0.04,
  },
  newMasterText: {
    lineHeight: 20,
  },
});
