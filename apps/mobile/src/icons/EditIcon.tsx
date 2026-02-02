import { colors } from '@avoo/design-tokens';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export const EditIcon = (props: Props) => {
  const { size = 20, color = colors.gray[400] } = props;
  return (
    <Svg height={size} viewBox='0 -960 960 960' width={size}>
      <Path
        d='M216-216h44.46l393.46-393.46-44.46-44.46L216-260.46V-216Zm-52 52v-118.38l497.62-498.39q8.07-8.24 17.37-11.73 9.3-3.5 19.49-3.5 10.2 0 19.47 3.27 9.28 3.27 17.97 11.58l44.85 44.46q8.31 8.69 11.77 18 3.46 9.31 3.46 19.17 0 10.51-3.64 20.06-3.65 9.55-11.59 17.46L282.38-164H164Zm580.38-535.15-45.23-45.23 45.23 45.23ZM631.3-631.3l-21.84-22.62 44.46 44.46-22.62-21.84Z'
        fill={color}
      />
    </Svg>
  );
};
