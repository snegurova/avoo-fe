import React from 'react';
import { View, ScrollView } from 'react-native';
import { TimeScaleColumn } from '../TimeScaleColumn/TimeScaleColumn';

type Props = {
  headerHeight: number;
  children: React.ReactNode;
};

export const TimelineGridLayout = (props: Props) => {
  const { headerHeight, children } = props;
  return (
    <View className="flex-1">
      <View className="flex-row">
        <TimeScaleColumn headerHeight={headerHeight} />
        <View className="flex-1">
          <ScrollView
            horizontal
            className="flex-1"
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            bounces={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
