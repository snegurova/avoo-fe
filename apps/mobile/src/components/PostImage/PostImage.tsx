import { View, useWindowDimensions } from 'react-native';

type Props = {
  padding?: number;
  gap?: number;
  columns?: number;
};

export const PostImage = (props: Props) => {
  const { padding = 20, gap = 8, columns = 3 } = props;
  const { width } = useWindowDimensions();
  const containerWidth = width - padding * 2;
  const itemWidth = (containerWidth - gap * (columns - 1)) / columns;

  return (
    <View
      className='bg-gray-200 rounded-lg'
      style={{ width: itemWidth, height: itemWidth }}
    />
  );
};

export default PostImage;

