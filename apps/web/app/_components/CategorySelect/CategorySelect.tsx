import { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Autocomplete, FormControl, FormHelperText, TextField } from '@mui/material';
import { Category } from '@avoo/axios/types/apiTypes';
import { CreateServiceFormData } from '@avoo/hooks';

type Props = {
  categories: Category[];
  control: Control<CreateServiceFormData>;
  error?: string;
};

export default function CategorySelect(props: Props) {
  const { categories, control, error } = props;
  const options = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      label: category.name,
    }));
  }, [categories]);
  return (
    <FormControl fullWidth error={!!error}>
      <Controller
        name='categoryId'
        control={control}
        render={({ field }) => (
          <Autocomplete
            disablePortal
            options={options}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={options.find((opt) => opt.id === field.value) ?? null}
            onChange={(_, newValue) => {
              field.onChange(newValue?.id ?? null);
            }}
            renderInput={(params) => <TextField {...params} label='Category' required />}
          />
        )}
      />

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
