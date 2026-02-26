import React, { useEffect, useState, useMemo } from 'react';
import {
  CreatePrivateOrder,
  Combination,
  MasterWithRelationsEntity,
  GetMastersQueryParams,
} from '@avoo/axios/types/apiTypes';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import FormTimePicker from '@/_components/FormTimePicker/FormTimePicker';
import CombinationElement from '@/_components/CombinationElement/CombinationElement';
import SearchField from '@/_components/SearchField/SearchField';
import MasterElement from '@/_components/MasterElement/MasterElement';
import { masterHooks } from '@avoo/hooks';
import CallSplitIcon from '@/_icons/CallSplitIcon';
import { IconButton } from '@/_components/IconButton/IconButton';

type Props = {
  value: CreatePrivateOrder[];
  onChange: (orders: CreatePrivateOrder[]) => void;
  selectedCombination: Combination;
  errors?: { [key: string]: { message: string } };
  selectedMasters: (MasterWithRelationsEntity | null)[];
  setSelectedMasters: (
    masters:
      | (MasterWithRelationsEntity | null)[]
      | ((prev: (MasterWithRelationsEntity | null)[]) => (MasterWithRelationsEntity | null)[]),
  ) => void;
  splitCombination: () => void;
};

export default function CombinationForm(props: Props) {
  const {
    value,
    onChange,
    selectedCombination,
    errors,
    selectedMasters,
    setSelectedMasters,
    splitCombination,
  } = props;

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

  const selectMaster = (val: { id: number } | null) => {
    if (!val) {
      return;
    }
    const newOrders = [...value];
    newOrders[0] = { ...newOrders[0], masterId: val.id };
    onChange(newOrders);

    setSelectedMasters((prev) => {
      const newMaster = masters?.find((master) => master.id === val.id) || null;
      return prev.map(() => newMaster);
    });
  };

  const onDateChange = (newDate: string) => {
    const newOrders = [...value];
    newOrders[0] = {
      ...newOrders[0],
      date: newDate,
    };
    onChange(newOrders);
  };

  const onNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOrders = [...value];
    newOrders[0] = { ...newOrders[0], notes: e.target.value };
    onChange(newOrders);
  };

  return (
    <div className='rounded-lg border border-gray-200'>
      <div className='bg-primary-50 px-4 p-2 h-14 rounded-t-lg flex items-center justify-between'>
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
            label='Master'
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
          />
          {selectedMasters[0] && <MasterElement item={selectedMasters[0]} isCard />}
        </div>
        <div className='grid grid-cols-3 gap-x-3'>
          <div className='col-span-2'>
            <label className='block mb-2 font-medium'>Date</label>
            <FormDatePicker date={value[0].date} onChange={onDateChange} />
          </div>
          <div className=' '>
            <label className='block mb-2 font-medium' htmlFor={`combination-time`}>
              Time
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
            label='Notes'
            helperText='Additional information for the master'
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
