import { CircularProgress } from '@mui/material';
import { AvatarSize } from '@/_components/Avatar/AvatarUpload';

type Props = {
  size: AvatarSize;
};

const AvatarLoader = (props: Props) => {
  const { size } = props;

  const circularProgressSize = size - 20;
  return (
    <span className='absolute inset-0 flex items-center justify-center'>
      <CircularProgress size={circularProgressSize} color='primary' />
    </span>
  );
};

export default AvatarLoader;
