import { Chip } from '@mui/material';

type Props = {
  name: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
};

const chipSx = (isActive: boolean) => ({
  height: 40,
  width: '100%',
  fontSize: 14,
  px: { xs: 2, lg: 1 },
  py: 1.375,
  '& .MuiChip-label': {
    width: '100%',
    p: 0,
    fontWeight: 400,
  },
  backgroundColor: {
    xs: isActive ? 'var(--color-primary-100)' : 'transparent',
    lg: isActive ? 'var(--color-primary-50)' : 'transparent',
  },
  borderColor: {
    xs: isActive ? 'transparent' : 'var(--color-primary-100)',
    lg: 'transparent',
  },
  borderRadius: {
    xs: '18px',
    lg: '8px',
  },
});

export default function CategoryFilterItem(props: Props) {
  const { name, count = 0, isActive = false, onClick } = props;
  return (
    <Chip
      label={
        <div className='flex items-center justify-between'>
          <span className='flex-1 min-w-0 max-w-[137px] truncate'>{name}</span>
          <span className='ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-200 bg-white text-xs text-gray-600'>
            {count}
          </span>
        </div>
      }
      variant={isActive ? 'filled' : 'outlined'}
      sx={chipSx(isActive)}
      onClick={onClick}
      clickable
    />
  );
}
