import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@/shared/icons';

type Props = {
  showBack?: boolean;
  onBackPress?: () => void;
};

export default function DefaultLeftContent(props: Props) {
  const { showBack, onBackPress } = props;
  const navigation = useNavigation();

  return showBack ? (
    <Pressable onPress={onBackPress || (() => navigation.goBack())}>
      <MaterialIcons name='arrow-back' size={24} color='black' />
    </Pressable>
  ) : (
    <Pressable hitSlop={{ top: 44, bottom: 44, left: 44, right: 44 }}>
      <MaterialIcons name='dehaze' size={24} color='black' />
    </Pressable>
  );
}

