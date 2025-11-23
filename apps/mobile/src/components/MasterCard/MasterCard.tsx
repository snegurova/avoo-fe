import { View, Text } from 'react-native';
import { Avatar } from '@/components/Avatar/Avatar';
import { components } from '@avoo/axios/types/generated';

type MasterEntity = components['schemas']['MasterEntity'];

type Props = {
  master: MasterEntity;
};

export const MasterCard = (props: Props) => {
  const { master } = props;

  return (
    <View className='items-center w-[30%]'>
      <View className='relative'>
        <Avatar
          size={80}
          imageUri={master.avatarUrl ?? undefined}
          iconName='user'
          iconColor='#64748b'
          iconSize={30}
          editable={false}
        />
      </View>
      <Text className='text-sm font-semibold text-slate-900 mt-2 text-center'>
        {master.name}
      </Text>
    </View>
  );
};

