import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import Layout from '@/shared/Layout/Layout';
import { masterHooks } from '@avoo/hooks';
import { MasterListItem } from '@/components/MasterListItem/MasterListItem';
import { SearchInput } from '@/shared/SearchInput/SearchInput';
import { layoutHooks } from '@/hooks/layoutHooks';
import { useBottomSheetStore, BottomSheetType } from '@/store/useBottomSheetStore';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import EditMasterForm from '@/components/EditMasterForm';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet';

export default function MastersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const bottomBarHeight = layoutHooks.useBottomBarHeight();

  const masters = masterHooks.useGetMastersProfileInfo();
  const filteredMasters = masterHooks.useFilterMasters(masters, searchQuery);
  const [selectedMaster, setSelectedMaster] = useState<MasterWithRelationsEntityResponse | null>(
    null,
  );

  const handleOpenBottomSheet = useBottomSheetStore((state) => state.handleOpenBottomSheet);

  const handleOpenForm = () => {
    handleOpenBottomSheet(BottomSheetType.CREATE_MASTER, {
      snapPoints: ['95%'],
    });
  };

  const handleMasterPress = (master: MasterWithRelationsEntityResponse) => {
    setSelectedMaster(master);
  };

  const handleCloseModal = () => {
    setSelectedMaster(null);
  };

  return (
    <>
      <Layout isScrollableDisabled={true} hasBottomTab={true}>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-xl font-bold text-black ml-4' style={styles.title}>
            Masters
          </Text>
          <Pressable
            className='flex-row items-center border border-primary-700 rounded-md px-4 py-3.5 gap-4'
            onPress={handleOpenForm}
          >
            <Text className='text-md font-bold text-primary-700 leading-4'>New master</Text>
          </Pressable>
        </View>
        <View className='flex-1'>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Search by name, phone or email'
          />
          <FlatList
            data={filteredMasters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MasterListItem master={item} onPress={handleMasterPress} />}
            contentContainerStyle={{ gap: 12, paddingBottom: bottomBarHeight, paddingTop: 28 }}
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

        <CustomBottomSheet visible={!!selectedMaster} onClose={handleCloseModal}>
          {selectedMaster && <EditMasterForm master={selectedMaster} onClose={handleCloseModal} />}
        </CustomBottomSheet>
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    lineHeight: 30,
    letterSpacing: 0.04,
  },
});
