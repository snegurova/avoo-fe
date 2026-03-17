import { Pressable, View } from 'react-native';

import { MaterialIcons } from '../icons';

type Props = {
  handleClose?: () => void;
  handleConfirm?: () => void;
};

export const BottomSheetHeader = ({ handleClose, handleConfirm }: Props) => {
  const hasButtons = handleClose || handleConfirm;

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
        </View>
      )}
    </View>
  );
};
