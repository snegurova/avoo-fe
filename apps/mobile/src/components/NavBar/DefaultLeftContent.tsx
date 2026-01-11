import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';

type Props = {
  showBack?: boolean;
  onBackPress?: () => void;
};

export default function DefaultLeftContent(props: Props) {
  const { showBack, onBackPress } = props;
  const navigation = useNavigation();

  return showBack ? (
    <Pressable onPress={onBackPress || (() => navigation.goBack())}>
      <MaterialIcons name='arrow-back' size={24} color={colors.black} />
    </Pressable>
  ) : null;
}
