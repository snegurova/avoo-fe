import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  Combination,
  CreateOrder,
  GetMastersQueryParams,
  MasterWithRelationsEntity,
  PublicCalendarQueryParams,
} from '@avoo/axios/types/apiTypes';
import { calendarHooks, masterHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import PublicCombinationCard from '@/_components/PublicCombinationCard/PublicCombinationCard';
import PublicDateTimeSelection from '@/_components/PublicDateTimeSelection/PublicDateTimeSelection';
import PublicMasterSearch from '@/_components/PublicMasterSearch/PublicMasterSearch';
import PublicOrderTitle from '@/_components/PublicOrderTitle/PublicOrderTitle';

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
};

export default function PublicCombinationForm(props: Props) {
  const t = useTranslations('public.salon.createOrder');
  const {
    value,
    onChange,
    selectedCombination,
    errors,
    selectedMasters,
    setSelectedMasters,
    splitCombination,
  } = props;

  const masterSelectionRef = useRef<HTMLDivElement>(null);
  const DateTimeSelectionRef = useRef<HTMLDivElement>(null);

  const searchParams = useParams();
  const userId = Number(searchParams.userId);

  const [masterSearch, setMasterSearch] = useState('');
  const [masterParams, setMasterParams] = useState<GetMastersQueryParams>({
    limit: 10,
    combinationId: selectedCombination?.id ?? undefined,
  });
  const [calendarParams, setCalendarParams] = useState<PublicCalendarQueryParams>({
    userId,
    rangeFromDate: timeUtils.formatDate(
      timeUtils.toDayBegin(value[0]?.date ? new Date(value[0].date) : new Date()),
    ),
    rangeToDate: timeUtils.formatDate(
      timeUtils.toDayEnd(value[0]?.date ? new Date(value[0].date) : new Date()),
    ),
  });
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [step, setStep] = useState(1);
  const [selectAnyMaster, setSelectAnyMaster] = useState(false);

  const { data: calendar } = calendarHooks.useGetPublicCalendar(calendarParams, {
    enabled: !!selectedCombination && !!selectedMasters[0],
  });

  useEffect(() => {
    const newValue = timeUtils.convertDateToString(
      selectedSlot ? selectedSlot : new Date(value[0]?.date || new Date()),
    );

    const newOrders = [...value];
    newOrders[0] = {
      ...newOrders[0],
      date: newValue,
    };
    onChange(newOrders);
  }, [selectedSlot]);

  const {
    data: mastersData,
    fetchNextPage: fetchNextMastersPage,
    hasNextPage: hasMoreMasters,
  } = masterHooks.useGetPublicMastersInfinite(masterParams);

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

    setCalendarParams((prev) => ({
      ...prev,
      masterIds: val.id ? [val.id] : undefined,
    }));
  };

  const onDateChange = (newDate: string) => {
    const newOrders = [...value];
    newOrders[0] = {
      ...newOrders[0],
      date: newDate,
    };
    onChange(newOrders);
    setCalendarParams((prev) => ({
      ...prev,
      rangeFromDate: timeUtils.formatDate(timeUtils.toDayBegin(new Date(newDate))),
      rangeToDate: timeUtils.formatDate(timeUtils.toDayEnd(new Date(newDate))),
    }));
  };

  const onNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOrders = [...value];
    newOrders[0] = { ...newOrders[0], notes: e.target.value };
    onChange(newOrders);
  };

  return (
    <div className=''>
      <div className='flex flex-col gap-4 py-4'>
        <div className='flex flex-col gap-4'>
          <PublicOrderTitle isActive={false} title='selectedServices' />
          {selectedCombination && (
            <PublicCombinationCard item={selectedCombination} onClick={splitCombination} />
          )}
          <FormTextArea
            id={`combination-notes`}
            name={`combination-notes`}
            value={value[0].notes || ''}
            onChange={onNotesChange}
            label={t('notes')}
            helperText={t('notesHelper')}
            maxLength={200}
            error={errors?.notes?.message}
            classNames={{
              label: 'block text-black font-medium',
              textarea:
                'block w-full text-sm text-black border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-black',
            }}
          />
        </div>

        <PublicMasterSearch
          selectedMaster={selectedMasters[0]}
          isActive={step === 2}
          items={masters}
          onChange={selectMaster}
          value={value[0].masterId ?? null}
          search={masterSearch}
          setSearch={setMasterSearch}
          hasMore={hasMoreMasters}
          fetchNextPage={fetchNextMastersPage}
          setStep={setStep}
          selectAnyMaster={selectAnyMaster}
          setSelectAnyMaster={setSelectAnyMaster}
          ref={masterSelectionRef}
        />

        <PublicDateTimeSelection
          ref={DateTimeSelectionRef}
          isActive={step === 3}
          date={value[0].date}
          onChange={onDateChange}
          error={errors?.date?.message}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          selectedService={selectedCombination}
          calendar={calendar}
          calendarParams={calendarParams}
          userId={userId}
          setStep={setStep}
        />
      </div>
    </div>
  );
}
