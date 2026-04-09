import { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Autocomplete, FormControl, FormHelperText, TextField } from '@mui/material';

import { Category } from '@avoo/axios/types/apiTypes';
import { CreateServiceFormData } from '@avoo/hooks/schemas/validationSchemas';
import { UpdateServiceFormData } from '@avoo/hooks/schemas/validationSchemas';

type Props = {
  categories: Category[];
  control: Control<CreateServiceFormData | UpdateServiceFormData>;
  error?: string;
};

export default function CategorySelect(props: Props) {
  const t = useTranslations('private.components.CategorySelect.CategorySelect');
  const tCategory = useTranslations('category.name');
  const { categories, control, error } = props;
  const options = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      label: tCategory(category.name),
    }));
  }, [categories]);
  return (
    <FormControl fullWidth error={!!error}>
      <Controller
        name='categoryId'
        control={control}
        render={({ field }) => (
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={options.find((opt) => opt.id === field.value) ?? null}
            onChange={(_, newValue) => {
              field.onChange(newValue?.id ?? null);
            }}
            renderInput={(params) => <TextField {...params} label={t('category')} required />}
          />
        )}
      />

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
