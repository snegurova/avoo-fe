import { Chip } from '@mui/material';

type Props = {
  name: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
};

export default function CategoryFilterItem(props: Props) {
  const { name, count = 0, isActive = false, onClick } = props;
  return (
    <Chip
      label={
        <div className='flex items-center justify-between'>
          <span
            className='flex-1'
            style={{
              maxWidth: '137px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </span>
          <span className='ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-200 bg-white text-xs text-gray-600'>
            {count}
          </span>
        </div>
      }
      variant={isActive ? 'filled' : 'outlined'}
      sx={{
        height: '40px',
        width: '100%',
        fontSize: '14px',
        padding: {
          xs: '11px 16px',
          lg: '11px 8px',
        },
        '& .MuiChip-label': {
          fontWeight: 400,
          width: {
            lg: '100%',
          },
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
      }}
      onClick={onClick}
      clickable
    />
  );
}
