import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';

import { MasterWithRelationsEntity, Service } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { timeUtils } from '@avoo/shared';

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

export type ServiceEntryState = {
  service: Service | null;
  master: MasterWithRelationsEntity | null;
  slot: string | null;
  notes: string;
  date: string;
};

type BusyRange = { slot: string; durationMinutes: number };

type Props = {
  entry: ServiceEntryState;
  index: number;
  canRemove: boolean;
  onChange: (patch: Partial<ServiceEntryState>) => void;
  onRemove: () => void;
  rangeFromTime?: string;
  busyRanges?: BusyRange[];
};

export const ServiceEntryItem = (props: Props) => {
  const { entry, index, canRemove, onChange, onRemove, rangeFromTime, busyRanges } = props;

  const [isServicePickerVisible, setServicePickerVisible] = useState(false);
  const [isMasterPickerVisible, setMasterPickerVisible] = useState(false);

  const {
    tempDate,
    setTempDate,
    isVisible: isDatePickerVisible,
    open: openDatePicker,
    close: closeDatePicker,
    confirm: confirmDate,
    dateLabel,
  } = uiHooks.useDatePicker(new Date(entry.date + 'T12:00:00'), () => onChange({ slot: null }));

  const { masters } = masterMobileHooks.useGetMastersFlattened({
    serviceId: entry.service?.id,
    limit: 50,
  });

  useEffect(() => {
    if (!entry.master && masters.length > 0 && masters[0]) {
      onChange({ master: masters[0] });
    }
  }, [masters]);

  const { slots, isLoading: isSlotsLoading } = calendarMobileHooks.useGetAvailableSlots(
    {
      serviceId: entry.service?.id,
      masterIds: entry.master ? [entry.master.id] : undefined,
      date: entry.date,
      duration: entry.service?.durationMinutes ?? 0,
      rangeFromTime,
    },
    { enabled: !!entry.service },
  );

  const filteredSlots = useMemo(() => {
    if (!busyRanges?.length) return slots;
    const durationMs = (entry.service?.durationMinutes ?? 0) * 60000;
    return slots.filter((slot) => {
      const slotStart = new Date(slot).getTime();
      const slotEnd = slotStart + durationMs;
      return !busyRanges.some(({ slot: busySlot, durationMinutes }) => {
        const busyStart = new Date(busySlot).getTime();
        const busyEnd = busyStart + durationMinutes * 60000;
        return slotStart < busyEnd && slotEnd > busyStart;
      });
    });
  }, [slots, busyRanges, entry.service?.durationMinutes]);

  const handleServiceSelect = (service: Service) => {
    onChange({ service, master: null, slot: null });
    setServicePickerVisible(false);
  };

  const handleMasterSelect = (ids: number[]) => {
    if (ids.length === 0) {
      onChange({ master: null, slot: null });
      setMasterPickerVisible(false);
      return;
    }
    const currentId = entry.master?.id;
    const newId = ids.find((id) => id !== currentId) ?? ids[0];
    const master = masters.find((m) => m.id === newId) ?? null;
    onChange({ master, slot: null });
    setMasterPickerVisible(false);
  };

  const handleDateConfirm = () => {
    const newDate = timeUtils.formatDate(tempDate);
    onChange({ date: newDate, slot: null });
    confirmDate();
  };

  const masterLabel = entry.master
    ? entry.master.name
    : masters.length === 1
      ? masters[0]?.name
      : undefined;

  return (
    <>
      <ServicePickerSheet
        visible={isServicePickerVisible}
        onClose={() => setServicePickerVisible(false)}
        onSelect={handleServiceSelect}
      />

      <MastersSheet
        visible={isMasterPickerVisible}
        onClose={() => setMasterPickerVisible(false)}
        masters={masters}
        selectedMasterIds={entry.master ? [entry.master.id] : []}
        onSelect={handleMasterSelect}
        hideAllMasters
      />

      {isDatePickerVisible && (
        <DatePickerSheet
          value={tempDate}
          onClose={closeDatePicker}
          onConfirm={handleDateConfirm}
          onChange={(_, date) => {
            if (date) setTempDate(date);
          }}
        />
      )}

      <View className='rounded-xl border border-gray-200 mb-4 overflow-hidden bg-white'>
        <View className='flex-row items-center justify-between px-4 pb-0 py-3'>
          <Text variant='titleLarge' style={{ color: colors.gray[900] }}>
            Service {index + 1}
          </Text>
          {canRemove && (
            <Pressable onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text variant='labelMedium' style={{ color: colors.red[500] }}>
                Remove
              </Text>
            </Pressable>
          )}
        </View>

        <View className='p-4'>
          <FormField label='Service'>
            {entry.service ? (
              <Pressable
                className='rounded-lg border border-gray-200 bg-white px-4 justify-center'
                style={{ height: 54 }}
                onPress={() => setServicePickerVisible(true)}
              >
                <View className='flex-row items-center justify-between flex-1'>
                  <View>
                    <Text className='text-base text-gray-900 mb-0.5'>{entry.service.name}</Text>
                    <Text className='text-sm text-gray-400'>
                      {timeUtils.getHumanDuration(entry.service.durationMinutes)}
                    </Text>
                  </View>
                  <Text className='text-base text-gray-900'>{entry.service.price} €</Text>
                </View>
              </Pressable>
            ) : (
              <LockedField
                value='Select service'
                onPress={() => setServicePickerVisible(true)}
                isPlaceholder
              />
            )}
          </FormField>

          <FormField label='Master'>
            <LockedField
              value={masterLabel ?? (entry.service ? 'Select master' : 'Select service first')}
              onPress={entry.service ? () => setMasterPickerVisible(true) : undefined}
              isPlaceholder={!masterLabel}
              disabled={!entry.service}
            />
          </FormField>

          <FormField label='Date'>
            <LockedField value={dateLabel} onPress={openDatePicker} />
          </FormField>

          <FormField label='Available time'>
            <TimeSlotChips
              slots={filteredSlots}
              selected={entry.slot}
              onSelect={(slot) => onChange({ slot })}
              isLoading={isSlotsLoading}
              enabled={!!entry.service}
            />
          </FormField>

          <FormField label='Note (optional)'>
            <NotesInput value={entry.notes} onChangeText={(notes) => onChange({ notes })} />
          </FormField>
        </View>
      </View>
    </>
  );
};
