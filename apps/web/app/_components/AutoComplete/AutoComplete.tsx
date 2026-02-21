import useAutocomplete, { UseAutocompleteProps } from '@mui/material/useAutocomplete';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import SelectCardItem from '../SelectCardItem/SelectCardItem';
import { colors } from '@avoo/design-tokens';

type BaseOption = {
  id: number;
  name: string;
  description: string;
  avatarUrl: string;
};

type AutoCompleteProps<Value extends BaseOption> = Omit<
  UseAutocompleteProps<Value, true, false, false>,
  'onChange' | 'value'
> & {
  labelName?: string;
  value?: Value[];
  onChange?: (value: Value[]) => void;
};

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(() => ({
  width: '100%',
  border: `1px solid ${colors.gray[100]}`,
  backgroundColor: colors.white,
  borderRadius: '4px',
  padding: '8px',
  paddingTop: '10px',
  paddingBottom: '10px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  '&:hover': {
    borderColor: colors.primary[200],
  },
  '&.focused': {
    border: `1px solid ${colors.primary[400]}`,
  },
  '& input': {
    backgroundColor: colors.white,
    color: colors.gray[900],
    height: '30px',
    boxSizing: 'border-box',
    padding: '4px 6px',
    width: '0',
    minWidth: '30px',
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
  },
}));

const Listbox = styled('ul')(() => ({
  width: '300px',
  margin: '2px 0 0',
  padding: 0,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: colors.white,
  overflow: 'auto',
  maxHeight: '250px',
  borderRadius: '4px',
  boxShadow: `0 2px 8px ${colors.gray[100]}`,
  zIndex: 1,
  '& li': {
    padding: '5px 12px',
    display: 'flex',
    '& span': {
      flexGrow: 1,
    },
    '& svg': {
      color: 'transparent',
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: colors.primary[50],
    fontWeight: 600,
    '& svg': {
      color: colors.primary[600],
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: colors.primary[100],
    cursor: 'pointer',
    '& svg': {
      color: 'currentColor',
    },
  },
}));

export function AutoComplete<Value extends BaseOption>(props: AutoCompleteProps<Value>) {
  const {
    labelName,
    value: controlledValue,
    onChange: controlledOnChange,
    ...autocompleteProps
  } = props;

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getItemProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    value: controlledValue,
    onChange: (_, newValue) => {
      controlledOnChange?.(newValue);
    },
    ...autocompleteProps,
  });

  return (
    <div className='relative'>
      <div {...getRootProps()}>
        {labelName && <Label {...getInputLabelProps()}>{labelName}</Label>}
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {value.map((option, index) => {
            const { key, ...itemProps } = getItemProps({ index });
            return <SelectCardItem key={key} {...option} {...itemProps} />;
          })}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key} {...optionProps}>
                <span>{props.getOptionLabel!(option)}</span>
              </li>
            );
          })}
        </Listbox>
      ) : null}
    </div>
  );
}
