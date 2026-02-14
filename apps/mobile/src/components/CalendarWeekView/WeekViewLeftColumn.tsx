import { View } from 'react-native';

import CalendarMaster from '../CalendarMaster/CalendarMaster';

import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';

type Props = {
  masters: ShortMasterInfo[];
  masterRowHeight: number;
};

export const WeekViewLeftColumn = (props: Props) => {
  const { masters, masterRowHeight } = props;
  return (
    <View>
      {masters.map((master, idx) => (
        <CalendarMaster
          key={master.id}
          master={master}
          headerHeight={masterRowHeight}
          borderBottom={idx < masters.length - 1}
        />
      ))}
    </View>
  );
};
