import IconLink from '../IconLink/IconLink';
import DeleteIcon from '@/_icons/DeleteIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import { IconButton } from '@mui/material';
import { useApiStatusStore } from '@avoo/store';
import { AvatarSize, CalendarAvatar } from '../CalendarAvatar/CalendarAvatar';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { tv } from 'tailwind-variants';

type Props = {
  id: number;
  name: string;
  startAt: Date;
  endAt: Date | null;
  master: MasterWithRelationsEntityResponse | null;
  isActive: boolean;
  onDelete: (id: number) => void;
};

export default function ScheduleListItem(props: Props) {
  const { id, name, startAt, endAt, master, isActive, onDelete } = props;

  const isPending = useApiStatusStore((state) => state.isPending);

  const convertDate = (date: Date | null) => {
    if (!date) return 'Ongoing';
    return date.toLocaleDateString();
  };

  const scheduleVariants = tv({
    base: 'grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_72px] px-6 py-4 text-sm font-regular hover:bg-primary-50',
    variants: {
      isActive: {
        true: '',
        false: 'bg-gray-100',
      },
    },
  });

  return (
    <div className={scheduleVariants({ isActive })}>
      <div className='flex flex-col justify-center'>
        <h3 className='font-medium'>{name}</h3>
      </div>
      <div className='flex flex-col justify-center'>
        {master ? (
          <div className='flex items-center gap-2 flex-row'>
            <CalendarAvatar name={master.name} size={AvatarSize.Small} idx={master.id} />
            <p>{master.name}</p>
          </div>
        ) : (
          <p>All Masters</p>
        )}
      </div>
      <div className='flex flex-col justify-center'>
        <p className='text-sm text-gray-700'>{convertDate(startAt)}</p>
      </div>
      <div className='flex flex-col justify-center'>
        <p className='text-sm text-gray-700'>{convertDate(endAt)}</p>
      </div>
      <div className='flex items-center me-2'>
        <IconLink
          href={'#'}
          icon={<EditSquareIcon className='transition-colors' />}
          label='Edit Service'
        />
        <IconButton
          aria-label='delete'
          onClick={() => {
            onDelete(id);
          }}
          loading={isPending}
          disabled={isPending}
        >
          <DeleteIcon className='transition-colors' />
        </IconButton>
      </div>
    </div>
  );
}
