import { View, Text } from 'react-native';
import { AvatarDisplay } from '@/components/Avatar/AvatarDisplay';
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
        <AvatarDisplay
          size={80}
          imageUri={master.avatarUrl}
          iconSize={30}
        />
      </View>
      <Text className='text-sm font-semibold text-slate-900 mt-2 text-center'>
        {master.name}
      </Text>
    </View>
  );
};

