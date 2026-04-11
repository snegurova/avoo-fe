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
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: '#141A23',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={8}
            >
              <MaterialIcons name='close' size={24} color='#141A23' />
            </Pressable>
          )}
          {handleConfirm && (
            <Pressable
              onPress={handleConfirm}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#141A23',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={8}
            >
              <MaterialIcons name='check' size={24} color='white' />
            </Pressable>
          )}
          {handleEdit && (
            <Pressable
              onPress={handleEdit}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#141A23',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={8}
            >
              <MaterialIcons name='edit' size={20} color='white' />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};
