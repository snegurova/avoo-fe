import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { customerHooks } from '@avoo/hooks';

import { ClientEditBottomSheet } from '@/components/ClientEditBottomSheet/ClientEditBottomSheet';
import { ClientListItem } from '@/components/ClientListItem/ClientListItem';
import { layoutHooks } from '@/hooks/layoutHooks';
import { GroupsIcon } from '@/icons';
import Layout from '@/shared/Layout/Layout';
import { SearchInput } from '@/shared/SearchInput/SearchInput';

export const ClientsScreen = () => {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<CustomerInfoResponse | null>(null);

  const { data, isFetching, fetchNextPage, hasNextPage } = customerHooks.useGetCustomersInfinite({
    search,
    limit: 20,
  });

  const clients = useMemo(() => data?.pages.flatMap((p) => p.data?.items ?? []) ?? [], [data]);

  const bottomBarHeight = layoutHooks.useBottomBarHeight();

  return (
    <>
      {selectedClient && (
        <ClientEditBottomSheet
          client={selectedClient}
          visible
          onClose={() => setSelectedClient(null)}
        />
      )}
      <Layout hasBottomTab isScrollableDisabled>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-xl font-bold text-black ml-4'>Clients</Text>
        </View>

        <SearchInput value={search} onChangeText={setSearch} placeholder='Search by...' />

        <View className='flex-1 mt-4'>
          {isFetching && clients.length === 0 ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={clients}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <ClientListItem client={item} onPress={setSelectedClient} />
              )}
              contentContainerStyle={{ paddingBottom: bottomBarHeight }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                search ? (
                  <View className='flex-1 justify-center items-center pt-8'>
                    <Text className='text-base text-gray-500'>No clients found</Text>
                  </View>
                ) : (
                  <View className='flex-1 justify-center items-center pt-16 px-6'>
                    <View className='w-[150px] h-[150px] rounded-full bg-primary-100 justify-center items-center mb-8'>
                      <GroupsIcon size={80} color={colors.primary[300]} />
                    </View>
                    <Text className='text-xl font-bold text-gray-900 mb-2 text-center'>
                      No clients yet
                    </Text>
                    <Text className='text-sm text-gray-500 text-center'>
                      Your clients will appear here after their first booking.
                    </Text>
                  </View>
                )
              }
              onEndReached={() => {
                if (hasNextPage && !isFetching) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </Layout>
    </>
  );
};
