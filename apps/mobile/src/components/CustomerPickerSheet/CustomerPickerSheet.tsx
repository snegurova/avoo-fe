import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { customerHooks } from '@avoo/hooks';

import { Avatar } from '@/shared/Avatar/Avatar';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { SearchInput } from '@/shared/SearchInput/SearchInput';

type NewClientData = {
  name: string;
  phone?: string;
  email?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectExisting: (customer: CustomerInfoResponse) => void;
  onCreateNew: (data: NewClientData) => void;
};

export const CustomerPickerSheet = (props: Props) => {
  const { visible, onClose, onSelectExisting, onCreateNew } = props;
  const [search, setSearch] = useState('');
  const [isNewClientMode, setIsNewClientMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const { data, isFetching, fetchNextPage, hasNextPage } = customerHooks.useGetCustomersInfinite({
    search,
    limit: 20,
  });
  const clients = data?.pages.flatMap((p) => p.data?.items ?? []) ?? [];

  const handleClose = () => {
    onClose();
    setSearch('');
    setIsNewClientMode(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  const handleSelectExisting = (customer: CustomerInfoResponse) => {
    onSelectExisting(customer);
    handleClose();
  };

  const handleAddNew = () => {
    if (!newName.trim()) return;
    onCreateNew({
      name: newName.trim(),
      phone: newPhone.trim() || undefined,
      email: newEmail.trim() || undefined,
    });
    handleClose();
  };

  return (
    <CustomBottomSheet visible={visible} onClose={handleClose}>
      <View className='px-4 pb-4' style={{ minHeight: 300 }}>
        <Text className='text-base font-semibold text-gray-900 mb-3'>Select client</Text>

        {isNewClientMode ? (
          <View>
            <Text className='text-sm font-medium text-gray-700 mb-1'>Name *</Text>
            <TextInput
              className='border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 mb-3'
              placeholder='Client name'
              placeholderTextColor={colors.gray[400]}
              value={newName}
              onChangeText={setNewName}
            />
            <Text className='text-sm font-medium text-gray-700 mb-1'>Phone</Text>
            <TextInput
              className='border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 mb-3'
              placeholder='+380...'
              placeholderTextColor={colors.gray[400]}
              keyboardType='phone-pad'
              value={newPhone}
              onChangeText={setNewPhone}
            />
            <Text className='text-sm font-medium text-gray-700 mb-1'>Email</Text>
            <TextInput
              className='border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 mb-4'
              placeholder='email@example.com'
              placeholderTextColor={colors.gray[400]}
              keyboardType='email-address'
              autoCapitalize='none'
              value={newEmail}
              onChangeText={setNewEmail}
            />
            <View className='flex-row gap-3'>
              <Pressable
                className='flex-1 border border-gray-200 rounded-lg py-3 items-center'
                onPress={() => setIsNewClientMode(false)}
              >
                <Text className='text-sm text-gray-600'>Back</Text>
              </Pressable>
              <Pressable
                className='flex-1 bg-primary-700 rounded-lg py-3 items-center'
                onPress={handleAddNew}
                disabled={!newName.trim()}
                style={{ opacity: newName.trim() ? 1 : 0.4 }}
              >
                <Text className='text-sm font-semibold text-white'>Add client</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View className='flex-row items-center gap-3 mb-3'>
              <View className='flex-1'>
                <SearchInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder='Search client...'
                />
              </View>
              <Pressable
                className='w-11 h-11 rounded-full bg-primary-400 items-center justify-center'
                onPress={() => setIsNewClientMode(true)}
              >
                <MaterialIcons name='add' size={24} color={colors.white} />
              </Pressable>
            </View>
            {isFetching && clients.length === 0 ? (
              <View className='py-8 items-center'>
                <ActivityIndicator />
              </View>
            ) : (
              <FlatList
                data={clients}
                keyExtractor={(item) => String(item.id)}
                style={{ maxHeight: 350 }}
                renderItem={({ item }) => (
                  <Pressable
                    className='flex-row items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 mb-2'
                    onPress={() => handleSelectExisting(item)}
                  >
                    <Avatar
                      name={item.name ?? undefined}
                      size={36}
                      backgroundColor={colors.primary[100]}
                      textStyle={{ fontSize: 14, lineHeight: 18 }}
                    />
                    <View className='flex-1'>
                      <Text className='text-sm font-medium text-gray-900'>{item.name ?? '—'}</Text>
                      {item.phone && <Text className='text-xs text-gray-500'>{item.phone}</Text>}
                    </View>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <View className='py-6 items-center'>
                    <Text className='text-sm text-gray-400'>
                      {search ? 'No clients found' : 'No clients yet'}
                    </Text>
                  </View>
                }
                onEndReached={() => {
                  if (hasNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
              />
            )}
          </>
        )}
      </View>
    </CustomBottomSheet>
  );
};
