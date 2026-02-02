import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import { tv } from 'tailwind-variants';
import { isFullSelection } from '@avoo/shared';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { Master } from '../CalendarSection/CalendarSection';

type Props = {
  visible: boolean;
  onClose: () => void;
  masters: Master[];
  selectedMasterIds: Set<string>;
  setSelectedMasterIds: (ids: Set<string>) => void;
};

const checkbox = tv({
  base: 'w-6 h-6 border-2 border-primary-500 rounded items-center justify-center mr-3',
  variants: {
    selected: {
      true: 'bg-primary-500',
      false: 'bg-transparent',
    },
  },
});

export const CalendarMastersSheet = (props: Props) => {
  const { visible, onClose, masters, selectedMasterIds, setSelectedMasterIds } = props;
  
  const isAllTeamSelected = isFullSelection(selectedMasterIds.size, masters.length);

  const handleAllTeamToggle = () => {
    if (isAllTeamSelected) {
      setSelectedMasterIds(masters.length > 0 ? new Set([masters[0].id]) : new Set());
    } else {
      setSelectedMasterIds(new Set(masters.map((m) => m.id)));
    }
  };

  const handleMasterToggle = (masterId: string) => {
    const newSelected = new Set(selectedMasterIds);
    if (newSelected.has(masterId)) {
      newSelected.delete(masterId);
    } else {
      newSelected.add(masterId);
    }
    setSelectedMasterIds(newSelected);
  };

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <View className='border border-dashed border-primary-500 rounded-xl m-4'>
        <Pressable
          className='px-4 py-4 border-dashed border-primary-500'
          onPress={handleAllTeamToggle}
        >
          <View className='flex-row items-center'>
            <View className={checkbox({ selected: isAllTeamSelected })}>
              {isAllTeamSelected && (
                <MaterialIcons name='check' size={16} color={colors.white} />
              )}
            </View>
            <Text variant='bodyMedium'>All Team</Text>
          </View>
        </Pressable>

        {masters.map((master) => {
          const isSelected = isAllTeamSelected || selectedMasterIds.has(master.id);
          return (
            <Pressable
              key={master.id}
              className='px-4 py-4 border-dashed border-primary-500'
              onPress={() => handleMasterToggle(master.id)}
            >
              <View className='flex-row items-center'>
                <View className={checkbox({ selected: isSelected })}>
                  {isSelected && (
                    <MaterialIcons name='check' size={16} color={colors.white} />
                  )}
                </View>
                <Text variant='bodyMedium'>{master.name}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </CustomBottomSheet>
  );
};
