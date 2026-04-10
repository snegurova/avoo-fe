'use client';

import React from 'react';

import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { timeOffConflictHooks } from '@avoo/hooks';
import type { TimeOffFormValues } from '@avoo/hooks/types/timeOffType';

import TimeOffConflictsSection from '../TimeOffConflictsSection/TimeOffConflictsSection';

type TimeOffConflictsContainerProps = {
  values: TimeOffFormValues;
  masters: ShortMasterInfo[];
};

export default function TimeOffConflictsContainer({
  values,
  masters,
}: Readonly<TimeOffConflictsContainerProps>) {
  const { conflictMessage, isConflictsLoading, affectedBookings } =
    timeOffConflictHooks.useTimeOffConflicts({
      values,
      masters,
    });

  return (
    <TimeOffConflictsSection
      isConflictsLoading={isConflictsLoading}
      conflictMessage={conflictMessage}
      affectedBookings={affectedBookings}
    />
  );
}
