import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { CreateServiceFormData } from '@avoo/hooks';
import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';

type Props = {
  masters: MasterWithRelationsEntityResponse[];
  control: Control<CreateServiceFormData>;
  error: string;
};

export default function MasterSelect(props: Props) {
  const { masters, control, error } = props;
  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel id='master-label'>Masters</InputLabel>

      <Controller
        name='masterIds'
        control={control}
        render={({ field }) => {
          const selectedIds = field.value ?? [];

          return (
            <Select
              multiple
              labelId='master-label'
              value={selectedIds.map(String)}
              onChange={(event) => {
                const value = event.target.value as string[];
                field.onChange(value.map(Number));
              }}
              renderValue={(selected) =>
                (selected as string[])
                  .map((id) => masters.find((m) => m.id === Number(id))?.name)
                  .filter(Boolean)
                  .join(', ')
              }
            >
              {masters.map((m) => {
                const isSelected = selectedIds.includes(m.id);

                return (
                  <MenuItem key={m.id} value={String(m.id)}>
                    <Checkbox checked={isSelected} />
                    <ListItemText primary={m.name} />
                  </MenuItem>
                );
              })}
            </Select>
          );
        }}
      />

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
