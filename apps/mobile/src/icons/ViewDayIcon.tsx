import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const ViewDayIcon = (props: Props) => {
  const { size = 24, color = '#e3e3e3' } = props;
  return (
    <Svg height={size} viewBox='0 -960 960 960' width={size}>
      <Path
        d='M120-160v-80h720v80H120Zm0-560v-80h720v80H120Zm80 400q-33 0-56.5-23.5T120-400v-160q0-33 23.5-56.5T200-640h560q33 0 56.5 23.5T840-560v160q0 33-23.5 56.5T760-320H200Zm0-80h560v-160H200v160Zm0-160v160-160Z'
        fill={color}
      />
    </Svg>
  );
};
