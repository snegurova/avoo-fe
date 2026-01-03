import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const HomeIcon = ({ size = 24, color = '#e3e3e3' }: Props) => {
  return (
    <Svg
      height={size}
      viewBox="0 -960 960 960"
      width={size}
    >
      <Path d="M240-200h133.85v-237.69h212.3V-200H720v-360L480-740.77 240-560v360Zm-60 60v-450l300-225.77L780-590v450H526.15v-237.69h-92.3V-140H180Zm300-330.38Z" fill={color} />
    </Svg>
  );
};

