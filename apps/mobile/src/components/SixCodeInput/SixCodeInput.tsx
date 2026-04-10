import { useRef, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Pressable, TextInput, TextInputProps } from 'react-native';

import SixCodeInputBoxes from '@/components/SixCodeInput/SixCodeInputBoxes';

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
  const [isFocused, setIsFocused] = useState(false);

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
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
      />

      <SixCodeInputBoxes code={value} isFocused={isFocused} />
    </Pressable>
  );
}
export default SixCodeInput;
