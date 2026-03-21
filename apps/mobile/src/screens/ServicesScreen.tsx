import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Service } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { categoriesHooks, servicesHooks, utils } from '@avoo/hooks';

import { CreateServiceBottomSheet } from '@/components/CreateServiceBottomSheet/CreateServiceBottomSheet';
import { EditServiceBottomSheet } from '@/components/EditServiceBottomSheet/EditServiceBottomSheet';
import { ServiceCategoryFilter } from '@/components/ServiceCategoryFilter/ServiceCategoryFilter';
import { ServiceListItem } from '@/components/ServiceListItem/ServiceListItem';
import { layoutHooks } from '@/hooks/layoutHooks';
import { AutoStoriesIcon } from '@/icons';
import Layout from '@/shared/Layout/Layout';
import { SearchInput } from '@/shared/SearchInput/SearchInput';

type FlatItem =
  | { type: 'header'; title: string; id: string }
  | { type: 'item'; service: Service; id: string };

export const ServicesScreen = () => {
  const {
    value: isCreateFormVisible,
    enable: openCreateForm,
    disable: closeCreateForm,
  } = utils.useBooleanState(false);

  const bottomBarHeight = layoutHooks.useBottomBarHeight();
  const { queryParams, params, setSearchQuery, setCategory } = servicesHooks.useServicesQuery();
  const { selectedService, setSelectedService } = servicesHooks.useServicesControls();

  const categoriesData = categoriesHooks.useGetCategories('');

  const servicesQuery = servicesHooks.useGetServicesInfinite(queryParams);
  const allServices = useMemo(
    () => servicesQuery.data?.pages.flatMap((p) => p.data?.items ?? []) ?? [],
    [servicesQuery.data],
  );

  const flatListData = useMemo<FlatItem[]>(() => {
    if (params.categoryId !== null) {
      return allServices.map((s) => ({ type: 'item' as const, service: s, id: `item-${s.id}` }));
    }

    const map = new Map<string, Service[]>();
    for (const service of allServices) {
      const catName = service.category.name;
      if (!map.has(catName)) map.set(catName, []);
      map.get(catName)!.push(service);
    }

    return Array.from(map.entries()).flatMap(([title, services]) => [
      { type: 'header' as const, title, id: `header-${title}` },
      ...services.map((s) => ({ type: 'item' as const, service: s, id: `item-${s.id}` })),
    ]);
  }, [allServices, params.categoryId]);

  return (
    <>
      <CreateServiceBottomSheet visible={isCreateFormVisible} onClose={closeCreateForm} />
      {selectedService && (
        <EditServiceBottomSheet
          service={selectedService}
          visible
          onClose={() => setSelectedService(null)}
        />
      )}
      <Layout isScrollableDisabled={true} hasBottomTab={true}>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-xl font-bold text-black ml-4' style={styles.title}>
            Services
          </Text>
          <Pressable
            className='flex-row items-center border border-primary-700 rounded-md px-4 py-3.5'
            onPress={openCreateForm}
          >
            <Text className='text-md font-bold text-primary-700 leading-4'>Add service</Text>
          </Pressable>
        </View>

        <SearchInput
          value={params.search}
          onChangeText={setSearchQuery}
          placeholder='Search service name'
        />

        <ServiceCategoryFilter
          categoriesData={categoriesData}
          selectedCategoryId={params.categoryId}
          onSelect={setCategory}
        />

        <View className='flex-1 mt-4'>
          <FlatList
            data={flatListData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return <Text className='text-base font-bold text-gray-800 mb-4'>{item.title}</Text>;
              }
              return <ServiceListItem service={item.service} onPress={setSelectedService} />;
            }}
            contentContainerStyle={{ paddingBottom: bottomBarHeight }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              servicesQuery.isFetching ? (
                <View className='flex-1 justify-center items-center pt-8'>
                  <ActivityIndicator />
                </View>
              ) : params.search ? (
                <View className='flex-1 justify-center items-center pt-8'>
                  <Text className='text-base text-gray-500'>No services found</Text>
                </View>
              ) : (
                <View className='flex-1 justify-center items-center pt-16 px-6'>
                  <View className='w-[150px] h-[150px] rounded-full bg-primary-100 justify-center items-center mb-8'>
                    <AutoStoriesIcon size={100} color={colors.primary[300]} />
                  </View>
                  <Text className='text-xl font-bold text-gray-900 mb-2 text-center'>
                    No services added yet
                  </Text>
                  <Text className='text-sm text-gray-500 text-center'>
                    Start by creating your first{' '}
                    <Text className='text-primary-900' onPress={openCreateForm}>
                      service
                    </Text>{' '}
                    to make it available for booking.
                  </Text>
                </View>
              )
            }
            onEndReached={() => {
              if (servicesQuery.hasNextPage && !servicesQuery.isFetchingNextPage) {
                servicesQuery.fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
          />
        </View>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    lineHeight: 30,
    letterSpacing: 0.04,
  },
});
