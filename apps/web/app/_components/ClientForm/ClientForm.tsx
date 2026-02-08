import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormInput, { AccessoryPosition } from '../FormInput/FormInput';
import LockIcon from '@/_icons/LockIcon';
import ModalActions from '../ModalActions/ModalActions';
import FormTextarea from '../FormTextArea/FormTextArea';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import { customerHooks } from '@avoo/hooks';
import HistoryCard from '../HistoryCard/HistoryCard';
import { useToast } from '@/_hooks/useToast';

export type FormValues = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  isNotificationEnable?: boolean;
};

type ClientFormProps = {
  initial: FormValues;
  onClose: () => void;
  onRequestClose?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
  id: number | null;
  notifyInitial?: boolean;
};

const mockHistory = [
  {
    dateDay: '12',
    dateMonth: 'Sep',
    time: '09:15',
    title: 'Haircut',
    duration: '1h 30min',
    master: 'Master Anna',
    price: '65 Euro',
    note: 'Note: ipsum dolor sit amet consectetur.',
  },
  {
    dateDay: '01',
    dateMonth: 'Oct',
    time: '14:00',
    title: 'Coloring',
    duration: '2h',
    master: 'Anna',
    price: '120 Euro',
    note: 'Note: ipsum dolor sit amet consectetur. Turpis lorem lectus egestas quam integer. Ac urna integer massa eu purus volutpat venenatis risus tincidunt.',
  },
  {
    dateDay: '22',
    dateMonth: 'Nov',
    time: '11:30',
    title: 'Styling',
    duration: '45min',
    master: 'Master Olga',
    price: '40 Euro',
    note: 'Quick styling session.',
  },
  {
    dateDay: '05',
    dateMonth: 'Dec',
    time: '16:45',
    title: 'Consultation',
    duration: '30min',
    master: 'Ivan',
    price: 'Free',
    note: 'Initial consultation.',
  },
];

export default function ClientForm({ ...props }: ClientFormProps) {
  const { initial, onClose, onRequestClose, onDirtyChange, id, notifyInitial = true } = props;

  const update = customerHooks.useUpdateCustomer();

  const toast = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty: hasChanges },
  } = useForm<FormValues>({ defaultValues: { ...initial, isNotificationEnable: notifyInitial } });

  React.useEffect(() => {
    reset({ ...initial, isNotificationEnable: notifyInitial });
  }, [initial, notifyInitial, reset]);

  React.useEffect(() => {
    if (onDirtyChange) onDirtyChange(hasChanges);
  }, [hasChanges, onDirtyChange]);

  const onSubmit = async (values: FormValues) => {
    if (id == null) {
      onClose();
      return;
    }

    const customerUpdateData = {
      name: values.name,
      phone: values.phone,
      notes: values.notes,
      isNotificationEnable: !!values.isNotificationEnable,
    };

    await update.updateCustomerAsync({ id, body: customerUpdateData });
    toast.success("Client's information changed successfully");
    onClose();
  };

  const loading = update.isPending;

  const makeToggleHandler = (field: { value?: boolean; onChange: (checked: boolean) => void }) => {
    return () => field.onChange(!field.value);
  };

  const handleCancel = React.useCallback(() => {
    (onRequestClose ?? onClose)();
  }, [onRequestClose, onClose]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-11'>
      <div className='flex flex-col space-y-6'>
        <h2 className='text-lg font-semibold mb-3'>Client information</h2>

        <div>
          <label htmlFor='name' className='text-sm'>
            Name
          </label>
          <FormInput id='name' {...register('name')} />
        </div>

        <div>
          <label htmlFor='email' className='text-sm'>
            Email address *
          </label>
          <FormInput
            id='email'
            {...register('email')}
            readOnly
            className='cursor-default'
            accessory={<LockIcon className='text-gray-400' />}
            accessoryPosition={AccessoryPosition.Right}
          />
        </div>

        <div>
          <label htmlFor='phone' className='text-sm'>
            Phone
          </label>
          <FormInput id='phone' {...register('phone')} />
        </div>

        <Controller
          name='notes'
          control={control}
          render={({ field }) => (
            <FormTextarea
              {...field}
              rows={3}
              label='Notes'
              showCounter={true}
              textareaClassAppend='text-xs'
            />
          )}
        />

        <div className='flex items-center justify-between mt-2'>
          <div className='text-sm'>
            <div>Notification</div>
            <p className='text-xs text-gray-500 mt-1 break-words'>
              Automatically sending appointment information to client via email
            </p>
          </div>

          <Controller
            name='isNotificationEnable'
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                ariaLabel='Toggle send notifications'
                checked={!!field.value}
                onChange={makeToggleHandler(field)}
              />
            )}
          />
        </div>
      </div>

      <div>
        <h2 className='text-lg font-semibold mb-3'>History</h2>
        <ul className='max-h-[140px] md:max-h-[270px] overflow-y-auto flex flex-col gap-3 pr-2'>
          {mockHistory.map((h, idx) => (
            <li key={idx} className='list-none'>
              <HistoryCard
                dateDay={h.dateDay}
                dateMonth={h.dateMonth}
                time={h.time}
                title={h.title}
                duration={h.duration}
                master={h.master}
                price={h.price}
                note={h.note}
              />
            </li>
          ))}
        </ul>
      </div>

      <ModalActions
        onCancel={handleCancel}
        submitType='submit'
        loading={loading}
        submitDisabled={!hasChanges}
      />
    </form>
  );
}
