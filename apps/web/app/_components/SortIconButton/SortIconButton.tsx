import { IconButton } from '@mui/material';

import ArrowDownIcon from '@/_icons/ArrowDownIcon';

type Props = {
  isPending: boolean;
  reverse: boolean;
};

export default function SortIconButton(props: Props) {
  const { isPending, reverse } = props;
  return (
    <IconButton
      aria-label='sort'
      disabled={isPending}
      sx={{
        transform: reverse ? 'rotate(180deg)' : 'none',
      }}
    >
      <ArrowDownIcon className='transition-colors' />
    </IconButton>
  );
}
