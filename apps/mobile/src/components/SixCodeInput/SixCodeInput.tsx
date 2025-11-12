import { useRef } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Pressable, TextInput, TextInputProps } from 'react-native';
import SixCodeInputBoxes from './SixCodeInputBoxes';

type Props<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
};

function SixCodeInput<T extends FieldValues>(props: Props<T>) {
  const { control, name } = props;

  const {
    field: { value, onChange, onBlur },
  } = useController({ control, name });

  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable className='items-center justify-center' onPress={() => inputRef.current?.focus()}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        keyboardType='decimal-pad'
        caretHidden
        maxLength={6}
        selectTextOnFocus={false}
        selectionColor='transparent'
        textContentType='none'
        className='w-full h-20 absolute z-20 color-transparent'
        onBlur={onBlur}
      />

      <SixCodeInputBoxes code={value} />
    </Pressable>
  );
}
export default SixCodeInput;
