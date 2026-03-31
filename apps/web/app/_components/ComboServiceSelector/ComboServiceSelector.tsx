'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Autocomplete, InputAdornment, InputLabel, TextField } from '@mui/material';
import { tv } from 'tailwind-variants';

import { Service } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { servicesHooks } from '@avoo/hooks';

import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import SearchIcon from '@/_icons/SearchIcon';

type Props = {
  items: Service[] | null;
  value: number[];
  onChange: (ids: number[]) => void;
  currentComboName?: string;
  onGenerateName?: (newName: string) => void;
  variant?: 'default' | 'modal';
  onDurationChange?: (duration: number) => void;
  masterIds?: number[];
};

export default function ComboServiceSelector(props: Props) {
  const t = useTranslations('private.components.ComboServiceSelector.ComboServiceSelector');
  const {
    value = [],
    onChange,
    currentComboName,
    onGenerateName,
    items,
    variant = 'default',
    onDurationChange,
    masterIds = [],
  } = props;

  const listWrapperClasses =
    variant === 'modal'
      ? 'flex flex-col gap-4 mb-2 pt-4 pr-3'
      : 'flex flex-col gap-4 mb-2 overflow-y-auto overflow-x-hidden max-h-[400px] pr-6 -mr-6 pt-4';

  const { queryParams, setSearchQuery, setMasterIds } = servicesHooks.useServicesQuery();
  const { data } = servicesHooks.useGetServicesInfinite(queryParams);
  const [inputText, setInputText] = useState('');
  const [selectedObjects, setSelectedObjects] = useState<Service[]>(items || []);

  const services = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  useEffect(() => {
    setMasterIds(masterIds);
  }, [masterIds, setMasterIds]);

  const handleSelect = (newValue: Service) => {
    const isAlreadySelected = value.includes(newValue.id);

    if (!isAlreadySelected) {
      const newSelectedObjects = [...selectedObjects, newValue];

      setSelectedObjects(newSelectedObjects);

      onChange([...value, newValue.id]);

      if (!currentComboName && onGenerateName && newSelectedObjects.length >= 2) {
        const generatedName = newSelectedObjects.map((s) => s.name).join(' + ');
        onGenerateName(generatedName);
      }

      let totalDuration = 0;
      newSelectedObjects.forEach((service) => {
        totalDuration += service.durationMinutes;
      });
      onDurationChange?.(totalDuration);
    }

    setInputText('');
    setSearchQuery('');
  };

  const handleRemove = (idToRemove: number) => {
    setSelectedObjects(selectedObjects.filter((s) => s.id !== idToRemove));
    onChange(value.filter((id) => id !== idToRemove));
  };

  const optionStyle = tv({
    base: 'flex items-center justify-between px-3 py-2',
    variants: {
      isSelected: {
        true: 'pointer-events-none bg-gray-50 text-bold font-bold bg-primary-50',
        false: 'hover:bg-gray-100',
      },
    },
  });

  return (
    <div className='flex flex-col w-full'>
      <InputLabel required={selectedObjects.length <= 1}>
        {selectedObjects.length <= 1 ? t('serviceSearch') : t('addMoreServices')}
      </InputLabel>

      <Autocomplete
        freeSolo
        options={services}
        value={null}
        inputValue={inputText}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        onInputChange={(_, newInputValue) => {
          setInputText(newInputValue);
          setSearchQuery(newInputValue);
        }}
        onChange={(_, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            handleSelect(newValue);
          }
        }}
        renderOption={(props, option) => {
          const { ...optionProps } = props;
          const isSelected = value.includes(option.id);
          return (
            <li {...optionProps} key={option.id} className={optionStyle({ isSelected })}>
              <span className='text-sm'>{option.name}</span>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size='small'
            fullWidth={true}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon style={{ marginLeft: '8px', fill: colors.gray[500] }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      {selectedObjects.length > 0 && (
        <div className={listWrapperClasses}>
          {selectedObjects.map((service, index) => (
            <div key={service.id} className='flex flex-col gap-1'>
              <InputLabel required={index <= 1}>
                {t('service')} {index + 1}
              </InputLabel>
              <ServiceElement
                item={service}
                hideMasters={true}
                isDurationChanged={true}
                onDelete={() => handleRemove(service.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
