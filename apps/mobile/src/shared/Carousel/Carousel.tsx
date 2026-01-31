import React, { useRef, useState } from 'react';
import { View, Pressable, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';

type Keyable = { id: string };

type Props<T extends Keyable> = {
  data: T[];
  renderItem: (item: T) => React.ReactElement;
};

export function Carousel<T extends Keyable>(props: Props<T>) {
  const { data, renderItem } = props;

  const listRef = useRef<FlatList<T> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, data.length - 1));
    listRef.current?.scrollToOffset({ offset: clamped * containerWidth, animated: true });
    setActiveIndex(clamped);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e?.nativeEvent?.contentOffset?.x ?? 0;
    const nextIndex = Math.round(x / containerWidth);
    setActiveIndex(Math.max(0, Math.min(nextIndex, data.length - 1)));
  };

  const handleScrollBack = () => {
    scrollTo(activeIndex - 1);
  };

  const handleScrollNext = () => {
    scrollTo(activeIndex + 1);
  };

  return (
    <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width: containerWidth }}>{renderItem(item)}</View>
        )}
      />

      <View className='flex-row items-center justify-between mt-4'>
        <Pressable
          onPress={handleScrollBack}
          disabled={activeIndex === 0}
          className='flex-row items-center border border-gray-200 rounded-full py-1 px-4 gap-2'
          style={{ opacity: activeIndex === 0 ? 0.5 : 1 }}
        >
          <MaterialIcons name='arrow-back' size={14} />
          <Text variant='bodySmall'>Back</Text>
        </Pressable>

        <View className='flex-row items-center gap-1'>
          {data.map((_, i) => (
            <View
              key={i}
              className='w-2 h-2 rounded-full'
              style={{
                backgroundColor: i === activeIndex ? colors.gray[500] : colors.gray[300],
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={handleScrollNext}
          disabled={activeIndex === data.length - 1}
          className='flex-row items-center border border-gray-200 rounded-full py-1 px-4 gap-2'
          style={{ opacity: activeIndex === data.length - 1 ? 0.5 : 1 }}
        >
          <Text variant='bodySmall'>Next</Text>
          <MaterialIcons name='arrow-forward' size={14} />
        </Pressable>
      </View>
    </View>
  );
}
