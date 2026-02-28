import { IconButton } from '@mui/material';
import { colors } from '@avoo/design-tokens';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  id: number;
  name: string;
  description: string;
  avatarUrl: string;
  onDelete: (id: number) => void;
};

const removeButtonSx = {
  padding: 0,
  position: 'absolute',
  top: 0,
  width: 20,
  height: 20,
  right: 0,
  background: colors.white,
  border: `1px solid ${colors.gray[100]}`,
  transform: 'translate(50%, -50%)',
};

export default function SelectCardItem(props: Props) {
  const { id, name, description, avatarUrl, onDelete } = props;
  return (
    <div className='bg-primary-50 p-2 rounded-lg flex items-center gap-4 justify-between border border-gray-100 relative max-w-[300px]'>
      <Avatar name={name} src={avatarUrl} size={AvatarSize.Large} bgColor={colors.primary[200]} />
      <div>
        <p className='font-semibold'>{name}</p>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
      <IconButton color='secondary' sx={removeButtonSx} onClick={() => onDelete(id)}>
        <CloseIcon fill={colors.black} width={12} height={12} />
      </IconButton>
    </div>
  );
}
