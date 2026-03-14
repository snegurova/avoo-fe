import { useEffect, useState } from 'react';

import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

import { CardAutocomplete } from '@/_components/AutoComplete/CardAutocomplete';

type MasterOption = {
  id: number;
  name: string;
  description: string;
  avatarUrl: string;
};

type Props = {
  masters: MasterWithRelationsEntityResponse[];
  value?: number[];
  onChange?: (ids: number[]) => void;
  onSearchChange?: (searchValue: string) => void;
  searchTerm?: string;
};

export default function MasterAutocompleteCardSelect(props: Props) {
  const { masters, value = [], onChange, onSearchChange, searchTerm } = props;
  const [cachedSelected, setCachedSelected] = useState<MasterOption[]>([]);

  const currentApiOptions: MasterOption[] = masters.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.headline ?? '',
    avatarUrl: m.avatarPreviewUrl ?? '',
  }));

  useEffect(() => {
    setCachedSelected((prevCache) => {
      const combined = [...prevCache, ...currentApiOptions];

      const uniqueOptions = Array.from(new Map(combined.map((item) => [item.id, item])).values());

      return uniqueOptions.filter((o) => value.includes(o.id));
    });
  }, [masters, value]);

  const allOptions = Array.from(
    new Map([...currentApiOptions, ...cachedSelected].map((item) => [item.id, item])).values(),
  );
  return (
    <CardAutocomplete<MasterOption>
      id='master-auto-complete-select'
      options={allOptions}
      value={cachedSelected}
      inputValue={searchTerm}
      onChange={(newOptions) => {
        onChange?.(newOptions.map((o) => o.id));
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === 'input') {
          onSearchChange?.(newInputValue);
        }
      }}
      getOptionLabel={(option) => option.name}
      filterOptions={(x) => x}
    />
  );
}
