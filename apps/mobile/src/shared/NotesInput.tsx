import { TextInput } from 'react-native';

import { colors } from '@avoo/design-tokens';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
};

export const NotesInput = ({ value, onChangeText, maxLength }: Props) => (
  <TextInput
    className='rounded-lg bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900'
    style={{ minHeight: 72, textAlignVertical: 'top' }}
    placeholder='Add a note...'
    placeholderTextColor={colors.gray[400]}
    multiline
    maxLength={maxLength}
    value={value}
    onChangeText={onChangeText}
  />
);
