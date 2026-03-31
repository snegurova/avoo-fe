import { Pressable, View } from 'react-native';

import { MaterialIcons } from '../icons';

type Props = {
  handleClose?: () => void;
  handleConfirm?: () => void;
  handleEdit?: () => void;
};

export const BottomSheetHeader = ({ handleClose, handleConfirm, handleEdit }: Props) => {
  const hasButtons = handleClose || handleConfirm || handleEdit;

  return (
    <View className={hasButtons ? 'pb-2' : 'pb-3'}>
      {hasButtons && (
        <View className='flex-row justify-between items-center px-5'>
          {handleClose && (
            <Pressable
              onPress={handleClose}
              className='w-11 h-11 rounded-full bg-primary-400 items-center justify-center'
              hitSlop={8}
            >
              <MaterialIcons name='close' size={30} color='white' />
            </Pressable>
          )}
          {handleConfirm && (
            <Pressable
              onPress={handleConfirm}
              className='w-11 h-11 rounded-full bg-primary-400 items-center justify-center'
              hitSlop={8}
            >
              <MaterialIcons name='check' size={30} color='white' />
            </Pressable>
          )}
          {handleEdit && (
            <Pressable
              onPress={handleEdit}
              className='w-11 h-11 rounded-full bg-primary-400 items-center justify-center'
              hitSlop={8}
            >
              <MaterialIcons name='edit' size={24} color='white' />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};
