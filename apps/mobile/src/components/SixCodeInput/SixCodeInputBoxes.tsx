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
            className='w-[50px] h-[66px] rounded-lg bg-black items-center justify-center'
          >
            <Text className='text-2xl text-white'>{char || ' '}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default SixCodeInputBoxes;
