import { Pressable, ScrollView, Text, View } from 'react-native';
import { Text as PaperText } from 'react-native-paper';

import { GetPrivateCategoriesResponse } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';

type Props = {
  categoriesData: GetPrivateCategoriesResponse | null;
  selectedCategoryId: number | null;
  onSelect: (id: number | null, name?: string) => void;
};

export const ServiceCategoryFilter = (props: Props) => {
  const { categoriesData, selectedCategoryId, onSelect } = props;
  const totalCount = categoriesData?.total ?? 0;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
      className='mt-3 flex-grow-0'
    >
      <Pressable
        className={`rounded-full px-4 py-2 flex-row items-center gap-2 border ${selectedCategoryId === null ? 'bg-primary-100 border-primary-100' : 'bg-white border-gray-200'}`}
        onPress={() => onSelect(null)}
      >
        <PaperText
          variant='bodyMedium'
          style={{ color: selectedCategoryId === null ? colors.gray[900] : colors.gray[700] }}
        >
          All categories
        </PaperText>
        <View
          className='items-center justify-center bg-white border border-gray-100 rounded-xl'
          style={{ minWidth: 20, height: 20 }}
        >
          <Text style={{ fontSize: 14, color: colors.gray[900] }}>{totalCount}</Text>
        </View>
      </Pressable>

      {(categoriesData?.categories ?? []).map((cat) => {
        const isActive = selectedCategoryId === cat.id;
        return (
          <Pressable
            key={cat.id}
            className={`rounded-full px-4 py-2 flex-row items-center gap-2 border ${isActive ? 'bg-primary-100 border-primary-100' : 'bg-white border-gray-200'}`}
            onPress={() => onSelect(cat.id, cat.name)}
          >
            <PaperText
              variant='bodyMedium'
              style={{ color: isActive ? colors.gray[900] : colors.gray[700] }}
            >
              {cat.name}
            </PaperText>
            <View
              className='items-center justify-center bg-white border border-gray-100 rounded-xl'
              style={{ minWidth: 20, height: 20 }}
            >
              <Text style={{ fontSize: 14, color: colors.gray[900] }}>{cat.totalServices}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
