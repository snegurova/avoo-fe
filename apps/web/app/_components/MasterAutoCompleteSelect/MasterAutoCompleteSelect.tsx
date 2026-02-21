import { AutoComplete } from '@/_components/AutoComplete/AutoComplete';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

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
};

export default function MasterAutoCompleteSelect(props: Props) {
  const { masters, value = [], onChange } = props;

  const options: MasterOption[] = masters.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.headline ?? '',
    avatarUrl: m.avatarUrl ?? '',
  }));

  const selectedOptions = options.filter((o) => value.includes(o.id));

  return (
    <AutoComplete<MasterOption>
      id='master-auto-complete-select'
      options={options}
      value={selectedOptions}
      onChange={(newOptions) => {
        onChange?.(newOptions.map((o) => o.id));
      }}
      getOptionLabel={(option) => option.name}
    />
  );
}
