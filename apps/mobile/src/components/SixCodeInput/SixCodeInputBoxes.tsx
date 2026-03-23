import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  code: string;
};

const SixCodeInputBoxes: React.FC<Props> = (props) => {
  const { code } = props;
  return (
    <View className='flex-row gap-1'>
      {Array.from({ length: 6 }).map((_, index) => {
        const char = code[index] ?? '';
        return (
          <View
            key={index}
            className='w-[50px] h-[66px] rounded-lg bg-primary-100 items-center justify-center'
          >
            <Text className='text-2xl text-primary-700'>{char || ' '}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default SixCodeInputBoxes;
