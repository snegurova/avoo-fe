import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import {
  CustomerInfoResponse,
  MasterWithRelationsEntity,
  Service,
} from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { orderHooks, utils } from '@avoo/hooks';
import { OrderType } from '@avoo/hooks/types/orderType';

import { CustomerPickerSheet } from '@/components/CustomerPickerSheet/CustomerPickerSheet';
import { DatePickerSheet } from '@/components/DatePickerSheet/DatePickerSheet';
import { LockedField } from '@/components/LockedField/LockedField';
import { MastersSheet } from '@/components/MastersSheet/MastersSheet';
import { ServicePickerSheet } from '@/components/ServicePickerSheet/ServicePickerSheet';
import { TimeSlotChips } from '@/components/TimeSlotChips/TimeSlotChips';
import { calendarMobileHooks } from '@/hooks/calendarHooks';
import { masterMobileHooks } from '@/hooks/masterHooks';
import { uiHooks } from '@/hooks/uiHooks';
import { FormField } from '@/shared/FormField';
import { NotesInput } from '@/shared/NotesInput';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type NewClientData = { name: string; phone?: string; email?: string };

type Props = {
  navigation: RootStackScreenProps<RootScreens.AddBookingScreen>['navigation'];
};

export const CreateOrderForm = (props: Props) => {
  const { navigation } = props;

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfoResponse | null>(null);
  const [newClientData, setNewClientData] = useState<NewClientData | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<MasterWithRelationsEntity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const {
    value: isCustomerPickerVisible,
    enable: openCustomerPicker,
    disable: closeCustomerPicker,
  } = utils.useBooleanState(false);

  const {
    value: isServicePickerVisible,
    enable: openServicePicker,
    disable: closeServicePicker,
  } = utils.useBooleanState(false);

  const {
    value: isMasterPickerVisible,
    enable: openMasterPicker,
    disable: closeMasterPicker,
  } = utils.useBooleanState(false);

  const {
    tempDate,
    setTempDate,
    isVisible: isDatePickerVisible,
    open: openDatePicker,
    close: closeDatePicker,
    confirm: confirmDate,
    dateStr,
    dateLabel,
  } = uiHooks.useDatePicker(new Date(), () => setSelectedSlot(null));

  const { masters } = masterMobileHooks.useGetMastersFlattened({
    serviceId: selectedService?.id,
    limit: 50,
  });

  const { slots, isLoading: isSlotsLoading } = calendarMobileHooks.useGetAvailableSlots(
    {
      serviceId: selectedService?.id,
      masterIds: selectedMaster ? [selectedMaster.id] : undefined,
      date: dateStr,
      duration: selectedService?.durationMinutes ?? 0,
    },
    { enabled: !!selectedService },
  );

  const { mutate, isPending } = orderHooks.useCreateOrderMutation({
    onSuccess: () => navigation.goBack(),
  });

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedMaster(null);
    setSelectedSlot(null);
  };

  const handleMasterSelect = (ids: number[]) => {
    if (ids.length === 0) {
      setSelectedMaster(null);
      setSelectedSlot(null);
      return;
    }
    const currentId = selectedMaster?.id;
    const newId = ids.find((id) => id !== currentId) ?? ids[0];
    const master = masters.find((m) => m.id === newId) ?? null;
    setSelectedMaster(master);
    setSelectedSlot(null);
  };

  const handleSubmit = () => {
    if (!selectedService || !selectedSlot) return;
    const hasCustomer = !!selectedCustomer || !!newClientData?.name;
    if (!hasCustomer) return;

    mutate({
      ordersData: [
        {
          type: OrderType.Service,
          serviceId: selectedService.id,
          masterId: selectedMaster?.id ?? 0,
          date: selectedSlot,
          notes: notes.trim() || undefined,
        },
      ],
      customerData: selectedCustomer
        ? { id: selectedCustomer.id as number }
        : {
            name: newClientData!.name,
            phone: newClientData!.phone ?? '',
            email: newClientData!.email,
          },
    });
  };

  const customerLabel = selectedCustomer
    ? (selectedCustomer.name ?? selectedCustomer.email ?? 'Client')
    : newClientData
      ? newClientData.name
      : undefined;

  const masterLabel = selectedMaster
    ? selectedMaster.name
    : masters.length === 1
      ? masters[0]?.name
      : selectedService
        ? 'All masters'
        : undefined;

  const canCreate =
    !!selectedService &&
    !!selectedSlot &&
    (!!selectedCustomer || !!newClientData?.name) &&
    (!!selectedMaster || masters.length > 0);

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

      <ServicePickerSheet
        visible={isServicePickerVisible}
        onClose={closeServicePicker}
        onSelect={handleServiceSelect}
      />

      <MastersSheet
        visible={isMasterPickerVisible}
        onClose={closeMasterPicker}
        masters={masters}
        selectedMasterIds={selectedMaster ? [selectedMaster.id] : []}
        onSelect={handleMasterSelect}
      />

      {isDatePickerVisible && (
        <DatePickerSheet
          value={tempDate}
          onClose={closeDatePicker}
          onConfirm={confirmDate}
          onChange={(_, date) => {
            if (date) setTempDate(date);
          }}
        />
      )}

      <FormField label='Client'>
        <LockedField
          value={customerLabel ?? 'Select client'}
          onPress={openCustomerPicker}
          isPlaceholder={!customerLabel}
        />
      </FormField>

      <FormField label='Service'>
        <LockedField
          value={selectedService?.name ?? 'Select service'}
          onPress={openServicePicker}
          isPlaceholder={!selectedService}
        />
      </FormField>

      <FormField label='Master'>
        <LockedField
          value={masterLabel ?? (selectedService ? 'Select master' : 'Select service first')}
          onPress={selectedService ? openMasterPicker : undefined}
          isPlaceholder={!masterLabel}
          disabled={!selectedService}
        />
      </FormField>

      <FormField label='Date'>
        <LockedField value={dateLabel} onPress={openDatePicker} />
      </FormField>

      <FormField label='Available time'>
        <TimeSlotChips
          slots={slots}
          selected={selectedSlot}
          onSelect={setSelectedSlot}
          isLoading={isSlotsLoading}
          enabled={!!selectedService}
        />
      </FormField>

      <FormField label='Note (optional)'>
        <NotesInput value={notes} onChangeText={setNotes} />
      </FormField>

      <View className='mt-2'>
        <Pressable
          className='rounded-xl py-4 items-center'
          style={{ backgroundColor: canCreate ? colors.primary[700] : colors.gray[200] }}
          onPress={handleSubmit}
          disabled={!canCreate || isPending}
        >
          {isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text
              className='text-base font-semibold'
              style={{ color: canCreate ? colors.white : colors.gray[400] }}
            >
              Create booking
            </Text>
          )}
        </Pressable>
      </View>
    </>
  );
};
