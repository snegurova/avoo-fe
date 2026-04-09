import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';

type Props = {
  code: string;
  isFocused?: boolean;
};

const SixCodeInputBoxes: React.FC<Props> = (props) => {
  const { code, isFocused = false } = props;

  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {Array.from({ length: 6 }).map((_, index) => {
        const char = code[index] ?? '';
        const isActive = isFocused && index === code.length;

        return (
          <View
            key={index}
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isActive ? colors.primary[500] : colors.gray[200],
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 32,
                lineHeight: 32,
                color: colors.gray['900'],
              }}
            >
              {char}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default SixCodeInputBoxes;
