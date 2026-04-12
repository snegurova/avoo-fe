import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

import { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { orderHooks, utils } from '@avoo/hooks';
import { OrderType } from '@avoo/hooks/types/orderType';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

import { CustomerPickerSheet } from '@/components/CustomerPickerSheet/CustomerPickerSheet';
import { LockedField } from '@/components/LockedField/LockedField';
import {
  ServiceEntryItem,
  ServiceEntryState,
} from '@/components/ServiceEntryItem/ServiceEntryItem';
import { FormField } from '@/shared/FormField';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type NewClientData = { name: string; phone?: string; email?: string };

type Props = {
  navigation: RootStackScreenProps<RootScreens.AddBookingScreen>['navigation'];
};

const createDefaultEntry = (): ServiceEntryState => ({
  service: null,
  master: null,
  slot: null,
  notes: '',
  date: timeUtils.formatDate(new Date()),
});

export const CreateOrderForm = (props: Props) => {
  const { navigation } = props;

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfoResponse | null>(null);
  const [newClientData, setNewClientData] = useState<NewClientData | null>(null);
  const [serviceEntries, setServiceEntries] = useState<ServiceEntryState[]>([createDefaultEntry()]);

  const {
    value: isCustomerPickerVisible,
    enable: openCustomerPicker,
    disable: closeCustomerPicker,
  } = utils.useBooleanState(false);

  const { mutate, isPending } = orderHooks.useCreateOrderMutation({
    onSuccess: () => navigation.goBack(),
  });

  const existingOrders = orderHooks.useGetCustomerOrderHistory(selectedCustomer?.id ?? null, 200);

  const updateEntry = (index: number, patch: Partial<ServiceEntryState>) => {
    setServiceEntries((prev) =>
      prev.map((entry, i) => {
        if (i === index) return { ...entry, ...patch };
        if (i > index && (patch.slot !== undefined || patch.service !== undefined)) {
          return { ...entry, slot: null };
        }
        return entry;
      }),
    );
  };

  const removeEntry = (index: number) => {
    setServiceEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const addService = () => {
    const last = serviceEntries[serviceEntries.length - 1];
    setServiceEntries((prev) => [...prev, { ...createDefaultEntry(), date: last.date }]);
  };

  const getBusyRanges = (index: number): Array<{ slot: string; durationMinutes: number }> => {
    const formBusy = serviceEntries
      .filter((e, i) => i !== index && e.slot !== null && e.service !== null)
      .map((e) => ({ slot: e.slot!, durationMinutes: e.service!.durationMinutes ?? 0 }));

    const date = serviceEntries[index]?.date;
    const existingBusy =
      date && existingOrders?.length
        ? existingOrders
            .filter((order) => {
              if (!['PENDING', 'CONFIRMED'].includes(order.status)) return false;
              return order.date.slice(0, 10) === date;
            })
            .map((order) => ({ slot: order.date, durationMinutes: order.duration }))
        : [];

    return [...formBusy, ...existingBusy];
  };

  const getRangeFromTime = (index: number): string | undefined => {
    if (index === 0) return undefined;
    const prev = serviceEntries[index - 1];
    const current = serviceEntries[index];
    if (!prev.slot || !prev.service) return undefined;
    if (!prev.master || !current.master || prev.master.id !== current.master.id) return undefined;
    const prevEnd = new Date(prev.slot);
    prevEnd.setMinutes(prevEnd.getMinutes() + (prev.service.durationMinutes ?? 0));
    return prevEnd.toISOString();
  };

  const lastEntry = serviceEntries[serviceEntries.length - 1];
  const canAddService = !!lastEntry?.service && !!lastEntry?.slot;

  const canCreate =
    serviceEntries.every((e) => e.service && e.master && e.slot) &&
    (!!selectedCustomer || !!newClientData?.name);

  const handleSubmit = () => {
    if (!canCreate) return;

    mutate(
      {
        ordersData: serviceEntries.map((e) => ({
          type: OrderType.Service,
          serviceId: e.service!.id,
          masterId: e.master!.id,
          date: e.slot!,
          notes: e.notes.trim() || undefined,
        })),
        customerData: selectedCustomer
          ? { id: selectedCustomer.id }
          : {
              name: newClientData!.name,
              phone: newClientData!.phone ?? '',
              email: newClientData!.email,
            },
      },
      {
        onError: (error: unknown) => {
          const errRecord = error && typeof error === 'object' ? error : null;
          const apiMessage =
            errRecord && 'errorMessage' in errRecord ? String(errRecord.errorMessage) : '';
          if (apiMessage.toLowerCase().includes('not found')) {
            useApiStatusStore
              .getState()
              .setError(true, 'Cannot add two identical services in a row');
          }
        },
      },
    );
  };

  const customerLabel = selectedCustomer
    ? (selectedCustomer.name ?? selectedCustomer.email ?? 'Client')
    : newClientData
      ? newClientData.name
      : undefined;

  return (
    <>
      <CustomerPickerSheet
        visible={isCustomerPickerVisible}
        onClose={closeCustomerPicker}
        onSelectExisting={(customer) => {
          setSelectedCustomer(customer);
          setNewClientData(null);
        }}
        onCreateNew={(data) => {
          setNewClientData(data);
          setSelectedCustomer(null);
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps='handled'
      >
        <FormField label='Client'>
          <LockedField
            value={customerLabel ?? 'Select client'}
            onPress={openCustomerPicker}
            isPlaceholder={!customerLabel}
          />
        </FormField>

        {serviceEntries.map((entry, index) => (
          <ServiceEntryItem
            key={index}
            entry={entry}
            index={index}
            canRemove={serviceEntries.length > 1}
            onChange={(patch) => updateEntry(index, patch)}
            onRemove={() => removeEntry(index)}
            rangeFromTime={getRangeFromTime(index)}
            busyRanges={getBusyRanges(index)}
          />
        ))}

        {canAddService && (
          <Pressable
            className='flex-row items-center justify-center mb-4'
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.gray[900],
              height: 44,
            }}
            onPress={addService}
          >
            <Text variant='labelLarge' style={{ color: colors.gray[900] }}>
              + Add service
            </Text>
          </Pressable>
        )}

        <View className='mt-2'>
          <Pressable
            className='items-center'
            style={{
              backgroundColor: canCreate ? colors.gray[900] : colors.gray[200],
              borderRadius: 8,
              height: 44,
              justifyContent: 'center',
            }}
            onPress={handleSubmit}
            disabled={!canCreate || isPending}
          >
            {isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text
                variant='labelLarge'
                style={{ color: canCreate ? colors.white : colors.gray[400] }}
              >
                Create booking
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};
