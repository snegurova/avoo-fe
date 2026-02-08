import { View } from 'react-native';
import { Avatar } from '@/shared/Avatar/Avatar';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { ObjectValues } from '@avoo/axios/types/apiEnums';

export const CALENDAR_MASTER_LAYOUT = {
  VERTICAL: 'vertical',
  INLINE: 'inline',
} as const;

export type CalendarMasterLayout = ObjectValues<typeof CALENDAR_MASTER_LAYOUT>;

const AVATAR_BG_BY_INDEX = [
  colors.primary[200],
  colors.blue[200],
  colors.orange[200],
  colors.green[200],
] as const;

type Props = {
  master: ShortMasterInfo | undefined;
  headerHeight?: number;
  borderBottom?: boolean;
  layout?: CalendarMasterLayout;
  serviceName?: string;
  colorIndex?: number;
};

export default function CalendarMaster(props: Props) {
  const { master: rawMaster, headerHeight = 20, borderBottom = true, layout = CALENDAR_MASTER_LAYOUT.VERTICAL, serviceName, colorIndex } = props;
  const isInline = layout === CALENDAR_MASTER_LAYOUT.INLINE;
  const avatarBg =
    colorIndex !== undefined ? AVATAR_BG_BY_INDEX[colorIndex % 4] : colors.primary[400];

  const name = rawMaster?.name ?? 'Unknown';
  const initial = name.charAt(0).toUpperCase();
  const words = name.split(' ');
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ') || ' ';

  return isInline ? (
    <View className='flex-row items-center gap-2 flex-1 min-w-0' style={{ minHeight: 24 }}>
      <Avatar
        name={initial}
        size={24}
        textStyle={{ fontSize: 14, lineHeight: 14 }}
        backgroundColor={avatarBg}
      />
      <Text
        variant='bodySmall'
        numberOfLines={1}
        style={{ lineHeight: 24, includeFontPadding: false }}
        className='flex-1 min-w-0'
      >
        {name}
        {serviceName ? ` · ${serviceName}` : ''}
      </Text>
    </View>
  ) : (
    <View
      className={
        borderBottom
          ? 'items-center justify-center border-b border-gray-200'
          : 'items-center justify-center'
      }
      style={{ height: headerHeight }}
    >
      <Avatar name={initial} size={32} backgroundColor={avatarBg} />
      <View className='mt-1 items-center' style={{ minHeight: 32 }}>
        <Text variant='bodySmall' style={{ textAlign: 'center' }}>
          {firstLine}
        </Text>
        <Text variant='bodySmall' style={{ textAlign: 'center' }}>
          {secondLine}
        </Text>
      </View>
    </View>
  );
}
