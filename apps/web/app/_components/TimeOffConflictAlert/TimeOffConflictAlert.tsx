import ErrorIcon from '@/_icons/ErrorIcon';

type Props = {
  message: string;
};

export default function TimeOffConflictAlert({ message }: Readonly<Props>) {
  return (
    <div className='flex items-center gap-3 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-900'>
      <ErrorIcon className='h-6 w-6 shrink-0 fill-current' />
      {message}
    </div>
  );
}
