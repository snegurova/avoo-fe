import React from 'react';
import { ScrollView, View } from 'react-native';
import { TimeScaleColumn } from '../TimeScaleColumn/TimeScaleColumn';
import { calendarConfig } from '../CalendarSection/calendarConfig';
import { animationHooks } from '../../hooks/animationHooks';

type Props = {
  headerHeight: number;
  stickyHeader: React.ReactNode;
  children: React.ReactNode;
  hideTimeScale?: boolean;
  leftColumn?: React.ReactNode;
  leftColumnWidth?: number;
};

export const TimelineGridLayout = (props: Props) => {
  const {
    headerHeight,
    stickyHeader,
    children,
    hideTimeScale = false,
    leftColumn,
    leftColumnWidth,
  } = props;
  const { headerScrollRef, onBodyHorizontalScroll } = animationHooks.useSyncedHorizontalScroll();

  const timeScaleWidth = calendarConfig.timeline.timeScaleWidth;

  return (
    <View className='flex-1'>
      <View className='flex-row' style={{ height: headerHeight }}>
        {!hideTimeScale && !leftColumn && (
          <View style={{ width: timeScaleWidth }} className='border-r border-gray-200 border-b' />
        )}
        {leftColumn && leftColumnWidth && (
          <View style={{ width: leftColumnWidth }} className='border-r border-gray-200 border-b' />
        )}

        <ScrollView
          ref={headerScrollRef}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          overScrollMode='never'
        >
          {stickyHeader}
        </ScrollView>
      </View>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator
        bounces={false}
        overScrollMode='never'
        scrollEventThrottle={16}
      >
        <View className='flex-row'>
          {!hideTimeScale && !leftColumn && <TimeScaleColumn />}
          {leftColumn && (
            <View style={{ width: leftColumnWidth }} className='border-r border-gray-200'>
              {leftColumn}
            </View>
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            overScrollMode='never'
            onScroll={onBodyHorizontalScroll}
            scrollEventThrottle={16}
            nestedScrollEnabled
          >
            {children}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};
