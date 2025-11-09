import { useCallback, memo } from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

type Props = {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

function Button(props: Props) {
  const { onPress, title, disabled = false, loading = false, style, textStyle } = props;

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);


  return (
    <Pressable
      className={`
        bg-blue-600 rounded-lg p-4 items-center mt-2
        ${disabled ? 'opacity-60' : ''}
        ${loading ? 'opacity-60' : ''}
      `}
      style={({ pressed }) => [
        !disabled && !loading && pressed && { opacity: 0.8 },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color='#FFFFFF' />
      ) : (
        <Text className='text-white text-lg font-semibold' style={textStyle}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}


export default memo(Button);
