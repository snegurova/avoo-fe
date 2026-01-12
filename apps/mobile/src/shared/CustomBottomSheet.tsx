import React, { useRef } from 'react';
import { View, Modal, Pressable, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const CustomBottomSheet = ({ visible, onClose, children }: Props) => {
  const { top } = useSafeAreaInsets();
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable className='flex-1 justify-end' style={{ paddingTop: top }} onPress={onClose}>
        <View className='bg-white rounded-t-2xl h-full' {...panResponder.panHandlers}>
          <View className='w-10 h-1 bg-gray-300 rounded-full self-center my-4' />
          {children}
        </View>
      </Pressable>
    </Modal>
  );
};

