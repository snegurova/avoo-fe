import { Pressable, Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';

export type TabItem<T extends string> = {
  key: T;
  label: string;
  count?: number;
};

type Props<T extends string> = {
  tabs: TabItem<T>[];
  activeTab: T;
  onSelect: (key: T) => void;
};

export const Tabs = <T extends string>(props: Props<T>) => {
  const { tabs, activeTab, onSelect } = props;

  return (
    <View className='flex-row border-b border-gray-200 mb-4'>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            className='flex-1 items-center pb-3 flex-row justify-center gap-2'
            style={{
              borderBottomWidth: isActive ? 2 : 0,
              borderBottomColor: isActive ? colors.primary[700] : 'transparent',
              marginBottom: -1,
            }}
          >
            <Text
              className='text-sm font-medium'
              style={{ color: isActive ? colors.primary[700] : colors.gray[500] }}
            >
              {tab.label}
            </Text>
            {tab.count != null && tab.count > 0 && (
              <View
                className='rounded-full px-1.5 py-0.5'
                style={{ backgroundColor: isActive ? colors.primary[100] : colors.gray[100] }}
              >
                <Text
                  className='text-xs font-medium'
                  style={{ color: isActive ? colors.primary[700] : colors.gray[500] }}
                >
                  {tab.count}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
