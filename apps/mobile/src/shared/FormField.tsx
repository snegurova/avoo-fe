import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  label: string;
  children: React.ReactNode;
};

export const FormField = ({ label, children }: Props) => (
  <View className='mb-4'>
    <Text className='text-sm font-medium text-gray-900 mb-2'>{label}</Text>
    {children}
  </View>
);
