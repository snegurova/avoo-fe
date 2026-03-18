import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  Combination,
  CreateOrder,
  GetMastersQueryParams,
  MasterWithRelationsEntity,
} from '@avoo/axios/types/apiTypes';
import { calendarHooks, masterHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';
import { useCalendarStore } from '@avoo/store';

import CombinationElement from '@/_components/CombinationElement/CombinationElement';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import FormTimePicker from '@/_components/FormTimePicker/FormTimePicker';
import { IconButton } from '@/_components/IconButton/IconButton';
import MasterElement from '@/_components/MasterElement/MasterElement';
import SearchField from '@/_components/SearchField/SearchField';
import { useToast } from '@/_hooks/useToast';
import CallSplitIcon from '@/_icons/CallSplitIcon';

type Props = {
  value: CreateOrder[];
  onChange: (orders: CreateOrder[]) => void;
  selectedCombination: Combination;
  errors?: { [key: string]: { message: string } };
  selectedMasters: (MasterWithRelationsEntity | null)[];
  setSelectedMasters: (
    masters:
      | (MasterWithRelationsEntity | null)[]
      | ((prev: (MasterWithRelationsEntity | null)[]) => (MasterWithRelationsEntity | null)[]),
  ) => void;
  splitCombination: () => void;
  setStartDate?: (date: string | null) => void;
};

export default function CombinationForm(props: Props) {
  const tCommon = useTranslations('private.components.CombinationForm.CombinationForm');
  const t = useTranslations('private.orders.create');
  const {
    value,
    onChange,
    selectedCombination,
    errors,
    selectedMasters,
    setSelectedMasters,
    splitCombination,
    setStartDate,
  } = props;

  const [isActiveMasterSearch, setIsActiveMasterSearch] = useState(false);
  const [masterSearch, setMasterSearch] = useState('');
  const [masterParams, setMasterParams] = useState<GetMastersQueryParams>({
    limit: 10,
    combinationId: selectedCombination.id,
  });

  const {
    data: mastersData,
    fetchNextPage: fetchNextMastersPage,
    hasNextPage: hasMoreMasters,
  } = masterHooks.useGetMastersInfinite(masterParams);
  const toast = useToast();

  const { getAvailableDate } = calendarHooks.useGetPrivateAvailability();
  const setDate = useCalendarStore((state) => state.setDate);
  const slots = useCalendarStore((state) => state.slots);
  const setSlots = useCalendarStore((state) => state.setSlots);

  const masters = useMemo(
    () =>
      (mastersData?.pages.flatMap((page) => page?.data?.items) || []).filter(
        (item): item is MasterWithRelationsEntity => item !== undefined,
      ),
    [mastersData],
  );

  useEffect(() => {
    setMasterParams((prev) => ({
      ...prev,
      search: masterSearch.trim() || undefined,
    }));
  }, [masterSearch]);

  const selectMaster = async (val: { id: number } | null) => {
    if (!val) {
      return;
    }
    const newOrders = [...value];

    const availabilityParams: {
      rangeFromTime: string;
      masterIds?: number[];
      serviceId?: number;
      combinationId?: number;
      index: number;
    } = {
      index: 0,
      rangeFromTime: newOrders[0].date,
      combinationId: selectedCombination.id,
    };

    if (val.id) {
      availabilityParams.masterIds = [val.id];
    }

    const availableDate = await getAvailableDate(availabilityParams);

    if (!availableDate) {
      toast.error(tCommon('noAvailableTime'));
      return;
    }

    setDate(timeUtils.toDayBegin(new Date(availableDate)));

    newOrders[0] = { ...newOrders[0], masterId: val.id, date: availableDate };
    onChange(newOrders);

    setSelectedMasters((prev) => {
      const newMaster = masters?.find((master) => master.id === val.id) || null;
      return prev.map(() => newMaster);
    });

    if (slots && slots[0]) {
      const newSlot = {
        ...slots[0],
        masterId: val.id,
        date: availableDate,
      };
      const newSlots = [...slots];
      newSlots[0] = newSlot;
      setSlots(newSlots);
    }
  };

  const onDateChange = async (newDate: string) => {
    const availabilityParams: {
      rangeFromTime: string;
      masterIds?: number[];
      serviceId?: number;
      combinationId?: number;
      index: number;
    } = {
      rangeFromTime: newDate,
      index: 0,
      combinationId: selectedCombination.id,
    };

    if (selectedMasters[0]) {
      availabilityParams.masterIds = [selectedMasters[0].id];
    }

    const availableDate = await getAvailableDate(availabilityParams);

    if (!availableDate) {
      toast.error(tCommon('noAvailableTime'));
      return;
    }

    setDate(timeUtils.toDayBegin(new Date(availableDate)));

    const newOrders = [...value];
    newOrders[0] = {
      ...newOrders[0],
      date: availableDate,
    };
    onChange(newOrders);

    if (setStartDate) {
      setStartDate(availableDate);
    }
  };

  const onNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOrders = [...value];
    newOrders[0] = { ...newOrders[0], notes: e.target.value };
    onChange(newOrders);
  };

  const onMasterElementClick = () => {
    setIsActiveMasterSearch(true);
  };

  return (
    <div className='rounded-lg border border-primary-200'>
      <div className='px-4 py-2 h-10 rounded-t-lg flex items-center justify-between transition-colors border-b bg-primary-200 border-primary-200'>
        <h3 className='font-medium'>{selectedCombination?.name}</h3>
        <IconButton
          className='group'
          icon={
            <CallSplitIcon className='w-5 h-5 transition-colors group-hover:fill-primary-500 group-focus:fill-primary-500' />
          }
          onClick={splitCombination}
        />
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <CombinationElement
          item={selectedCombination}
          isCard
          hideMasters
          master={selectedMasters[0] || undefined}
        />
        <div className=''>
          <SearchField
            label={tCommon('master')}
            value={value[0].masterId ? { id: value[0].masterId } : null}
            onChange={selectMaster}
            items={masters}
            search={masterSearch}
            setSearch={setMasterSearch}
            ItemElement={MasterElement}
            searchMode={!value[0].masterId}
            error={errors?.masterId?.message}
            hasMore={hasMoreMasters}
            fetchNextPage={fetchNextMastersPage}
            isActive={isActiveMasterSearch}
            setIsActive={setIsActiveMasterSearch}
          >
            {selectedMasters[0] && (
              <MasterElement item={selectedMasters[0]} isCard onClick={onMasterElementClick} />
            )}
          </SearchField>
        </div>
        <div className='grid grid-cols-3 gap-x-3'>
          <div className='col-span-2'>
            <label className='block mb-2 font-medium'>{t('date')}</label>
            <FormDatePicker date={value[0].date} onChange={onDateChange} />
          </div>
          <div className=' '>
            <label className='block mb-2 font-medium' htmlFor={`combination-time`}>
              {t('time')}
            </label>
            <FormTimePicker date={value[0].date} onChange={onDateChange} />
          </div>
          {errors?.date?.message && (
            <div className='mt-1 text-sm text-red-500 col-span-3'>{errors?.date?.message}</div>
          )}
        </div>
        <div className=''>
          <FormTextArea
            id={`combination-notes`}
            name={`combination-notes`}
            value={value[0].notes || ''}
            onChange={onNotesChange}
            label={t('notes')}
            helperText={t('helperText')}
            maxLength={200}
            error={errors?.notes?.message}
            classNames={{
              label: 'block font-medium',
              textarea:
                'block w-full text-sm text-black border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-purple-800',
            }}
          />
        </div>
      </div>
    </div>
  );
}
