import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { MaterialIcons } from '@expo/vector-icons';
import { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

import { colors } from '@avoo/design-tokens';
import { orderHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { DatePickerSheet } from '@/components/DatePickerSheet/DatePickerSheet';
import { MastersSheet } from '@/components/MastersSheet/MastersSheet';
import { OrderBottomSheet } from '@/components/OrderBottomSheet/OrderBottomSheet';
import { OrderListItem } from '@/components/OrderListItem/OrderListItem';
import { layoutHooks } from '@/hooks/layoutHooks';
import { masterMobileHooks } from '@/hooks/masterHooks';
import { EditCalendarIcon } from '@/icons';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import Layout from '@/shared/Layout/Layout';
import { RadioListItem } from '@/shared/RadioListItem/RadioListItem';
import { RootNavigationProp, RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.OrdersScreen>;

const STATUS_FILTERS: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'All statuses', value: undefined },
  { label: 'Pending', value: OrderStatus.PENDING },
  { label: 'Confirmed', value: OrderStatus.CONFIRMED },
  { label: 'Completed', value: OrderStatus.COMPLETED },
  { label: 'Expired', value: OrderStatus.EXPIRED },
  { label: 'Canceled', value: OrderStatus.CANCELED },
];

const OrdersScreen = ({ route }: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | undefined>(
    route.params?.initialStatus,
  );

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [tempFromDate, setTempFromDate] = useState(new Date());
  const [tempToDate, setTempToDate] = useState(new Date());
  const [isFromPickerOpen, setFromPickerOpen] = useState(false);
  const [isToPickerOpen, setToPickerOpen] = useState(false);

  const [selectedMasterIds, setSelectedMasterIds] = useState<number[]>([]);
  const [isMasterSheetVisible, setMasterSheetVisible] = useState(false);
  const { masters } = masterMobileHooks.useGetMastersFlattened({ limit: 100 });

  const [isStatusSheetVisible, setStatusSheetVisible] = useState(false);

  const { data, isFetching, fetchNextPage, hasNextPage } = orderHooks.useGetOrdersInfinite({
    limit: 20,
    status: activeStatus,
    masterId: selectedMasterIds[0],
    dateFrom: fromDate?.toISOString(),
    dateTo: toDate?.toISOString(),
  });

  const orders = useMemo(() => data?.pages.flatMap((p) => p.data?.items ?? []) ?? [], [data]);
  const bottomBarHeight = layoutHooks.useBottomBarHeight();

  const fromLabel = fromDate ? timeUtils.formatShortDateLabel(fromDate) : 'From';
  const toLabel = toDate ? timeUtils.formatShortDateLabel(toDate) : 'To';
  const selectedMaster = masters.find((m) => m.id === selectedMasterIds[0]);
  const masterLabel = selectedMaster?.name ?? 'All masters';
  const statusLabel = STATUS_FILTERS.find((f) => f.value === activeStatus)?.label ?? 'All statuses';

  const hasMasterFilter = selectedMasterIds.length > 0;
  const hasStatusFilter = !!activeStatus;

  return (
    <>
      <OrderBottomSheet
        visible={!!selectedOrderId}
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />

      {isFromPickerOpen && (
        <DatePickerSheet
          value={tempFromDate}
          onChange={(_: DateTimePickerEvent, date?: Date) => {
            if (date) setTempFromDate(date);
          }}
          onConfirm={() => {
            setFromDate(tempFromDate);
            setFromPickerOpen(false);
          }}
          onClose={() => setFromPickerOpen(false)}
        />
      )}

      {isToPickerOpen && (
        <DatePickerSheet
          value={tempToDate}
          onChange={(_: DateTimePickerEvent, date?: Date) => {
            if (date) setTempToDate(date);
          }}
          onConfirm={() => {
            setToDate(tempToDate);
            setToPickerOpen(false);
          }}
          onClose={() => setToPickerOpen(false)}
        />
      )}

      <MastersSheet
        visible={isMasterSheetVisible}
        onClose={() => setMasterSheetVisible(false)}
        masters={masters}
        selectedMasterIds={selectedMasterIds}
        onSelect={(ids) => {
          const added = ids.find((id) => !selectedMasterIds.includes(id));
          setSelectedMasterIds(added !== undefined ? [added] : []);
        }}
      />

      <CustomBottomSheet
        visible={isStatusSheetVisible}
        onClose={() => setStatusSheetVisible(false)}
        snapToContent
      >
        <View className='px-4 pb-4'>
          {STATUS_FILTERS.map((filter) => (
            <RadioListItem
              key={filter.label}
              label={filter.label}
              isSelected={activeStatus === filter.value}
              onPress={() => {
                setActiveStatus(filter.value);
                setStatusSheetVisible(false);
              }}
            />
          ))}
        </View>
      </CustomBottomSheet>

      <Layout hasBottomTab isScrollableDisabled showBack>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='ml-4' style={styles.title}>
            Orders
          </Text>
          <Pressable
            className='flex-row items-center border border-primary-700 rounded-md px-4 py-3.5'
            onPress={() => navigation.navigate(RootScreens.AddBookingScreen)}
          >
            <Text style={styles.newOrderBtn}>New order</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingBottom: 12, alignItems: 'center', gap: 8 }}
        >
          <Pressable
            onPress={() => {
              setTempFromDate(fromDate ?? new Date());
              setFromPickerOpen(true);
            }}
            style={[styles.filterBtn, fromDate ? styles.filterBtnActive : styles.filterBtnDefault]}
          >
            <MaterialIcons
              name='calendar-today'
              size={14}
              color={fromDate ? colors.primary[700] : colors.gray[500]}
            />
            <Text
              variant='bodyMedium'
              style={{ color: fromDate ? colors.primary[700] : colors.gray[500] }}
            >
              {fromLabel}
            </Text>
            {fromDate && (
              <Pressable hitSlop={8} onPress={() => setFromDate(null)}>
                <MaterialIcons name='close' size={14} color={colors.gray[400]} />
              </Pressable>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setTempToDate(toDate ?? new Date());
              setToPickerOpen(true);
            }}
            style={[styles.filterBtn, toDate ? styles.filterBtnActive : styles.filterBtnDefault]}
          >
            <MaterialIcons
              name='calendar-today'
              size={14}
              color={toDate ? colors.primary[700] : colors.gray[500]}
            />
            <Text
              variant='bodyMedium'
              style={{ color: toDate ? colors.primary[700] : colors.gray[500] }}
            >
              {toLabel}
            </Text>
            {toDate && (
              <Pressable hitSlop={8} onPress={() => setToDate(null)}>
                <MaterialIcons name='close' size={14} color={colors.gray[400]} />
              </Pressable>
            )}
          </Pressable>

          <Pressable
            onPress={() => setMasterSheetVisible(true)}
            style={[
              styles.filterBtn,
              hasMasterFilter ? styles.filterBtnActive : styles.filterBtnDefault,
            ]}
          >
            <MaterialIcons
              name='person'
              size={14}
              color={hasMasterFilter ? colors.primary[700] : colors.gray[500]}
            />
            <Text
              variant='bodyMedium'
              style={{ color: hasMasterFilter ? colors.primary[700] : colors.gray[500] }}
            >
              {masterLabel}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setStatusSheetVisible(true)}
            style={[
              styles.filterBtn,
              hasStatusFilter ? styles.filterBtnActive : styles.filterBtnDefault,
            ]}
          >
            <MaterialIcons
              name='filter-list'
              size={14}
              color={hasStatusFilter ? colors.primary[700] : colors.gray[500]}
            />
            <Text
              variant='bodyMedium'
              style={{ color: hasStatusFilter ? colors.primary[700] : colors.gray[500] }}
            >
              {statusLabel}
            </Text>
          </Pressable>
        </ScrollView>

        <View className='flex-1'>
          {isFetching && orders.length === 0 ? (
            <View className='flex-1 items-center justify-center'>
              <ActivityIndicator color={colors.primary[700]} />
            </View>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <OrderListItem order={item} onPress={setSelectedOrderId} />}
              contentContainerStyle={{ paddingBottom: bottomBarHeight }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className='flex-1 justify-center items-center pt-16 px-6'>
                  <View className='w-[150px] h-[150px] rounded-full bg-primary-100 justify-center items-center mb-8'>
                    <EditCalendarIcon size={100} color={colors.primary[300]} />
                  </View>
                  <Text variant='titleLarge' style={{ marginBottom: 8, textAlign: 'center' }}>
                    No orders yet
                  </Text>
                  <Text
                    variant='bodyMedium'
                    style={{ color: colors.gray[500], textAlign: 'center' }}
                  >
                    Orders will appear here once they are created.
                  </Text>
                </View>
              }
              onEndReached={() => {
                if (hasNextPage && !isFetching) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetching && orders.length > 0 ? (
                  <ActivityIndicator color={colors.primary[700]} style={{ marginVertical: 16 }} />
                ) : null
              }
            />
          )}
        </View>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    lineHeight: 30,
    letterSpacing: 0.04,
    fontWeight: '700',
    fontSize: 20,
    color: '#0C1015',
  },
  newOrderBtn: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
    color: colors.primary[700],
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  filterBtnDefault: {
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  filterBtnActive: {
    borderColor: colors.primary[700],
    backgroundColor: colors.primary[50],
  },
});

export default OrdersScreen;
