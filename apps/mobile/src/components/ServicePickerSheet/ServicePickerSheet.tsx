import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { Service } from '@avoo/axios/types/apiTypes';
import { servicesHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { SearchInput } from '@/shared/SearchInput/SearchInput';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (service: Service) => void;
};

export const ServicePickerSheet = (props: Props) => {
  const { visible, onClose, onSelect } = props;
  const [search, setSearch] = useState('');

  const query = servicesHooks.useGetServicesInfinite({ search, isActive: true });
  const services = useMemo(
    () => query.data?.pages.flatMap((p) => p.data?.items ?? []) ?? [],
    [query.data],
  );

  const handleSelect = (service: Service) => {
    onSelect(service);
    onClose();
    setSearch('');
  };

  return (
    <CustomBottomSheet visible={visible} onClose={onClose}>
      <View className='px-4 pb-4' style={{ minHeight: 300 }}>
        <Text className='text-base font-semibold text-gray-900 mb-3'>Select service</Text>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search service...'
          containerStyle={{ marginBottom: 12 }}
        />
        {query.isFetching && services.length === 0 ? (
          <View className='py-8 items-center'>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => String(item.id)}
            style={{ maxHeight: 400 }}
            renderItem={({ item }) => (
              <Pressable
                className='flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-2'
                onPress={() => handleSelect(item)}
              >
                <View className='flex-1 mr-3'>
                  <Text className='text-sm font-medium text-gray-900'>{item.name}</Text>
                  <Text className='text-xs text-gray-500 mt-0.5'>
                    {timeUtils.getHumanDuration(item.durationMinutes)} · {item.price} €
                  </Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View className='py-6 items-center'>
                <Text className='text-sm text-gray-400'>No services found</Text>
              </View>
            }
            onEndReached={() => {
              if (query.hasNextPage && !query.isFetchingNextPage) {
                query.fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </CustomBottomSheet>
  );
};
