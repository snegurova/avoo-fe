import { IconButton } from '@mui/material';
import { colors } from '@avoo/design-tokens';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  id: number;
  name: string;
  avatarUrl: string;
  specialty: string;
  onRemove: (id: number) => void;
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

export default function MasterSelectCard(props: Props) {
  const { id, name, specialty, avatarUrl, onRemove } = props;
  return (
    <div className='bg-primary-50 p-2 rounded-lg flex items-center gap-4 justify-between border border-gray-100 relative'>
      <Avatar name={name} src={avatarUrl} size={AvatarSize.Large} bgColor={colors.primary[200]} />
      <div>
        <p className='font-semibold'>{name}</p>
        <p className='text-sm text-gray-500'>{specialty}</p>
      </div>
      <IconButton color='secondary' sx={removeButtonSx} onClick={() => onRemove(id)}>
        <CloseIcon fill={colors.black} width={12} height={12} />
      </IconButton>
    </div>
  );
}
