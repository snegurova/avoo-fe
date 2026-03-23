import { useState } from 'react';
import { Text, View } from 'react-native';

import { orderHooks } from '@avoo/hooks';

import { ClientOrderCard } from '@/components/ClientOrderCard/ClientOrderCard';
import { TabItem, Tabs } from '@/components/Tabs/Tabs';

type Props = {
  customerId: number | null;
};

type Tab = 'next' | 'history';

export const ClientOrdersHistory = (props: Props) => {
  const { customerId } = props;
  const [activeTab, setActiveTab] = useState<Tab>('next');

  const { nextAppointments, historyItems } = orderHooks.useCustomerOrdersHistory(customerId);

  const tabs: TabItem<Tab>[] = [
    { key: 'next', label: 'Next appointment', count: nextAppointments.length },
    { key: 'history', label: 'History', count: historyItems.length },
  ];

  const items = activeTab === 'next' ? nextAppointments : historyItems;
  const emptyText =
    activeTab === 'next'
      ? { title: 'No upcoming appointments', subtitle: 'Upcoming visits will appear here' }
      : { title: 'No previous appointments', subtitle: 'Visit history will appear here' };

  return (
    <View>
      <Tabs tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} />
      {items.length > 0 ? (
        items.map((order) => <ClientOrderCard key={order.id} order={order} />)
      ) : (
        <View className='py-6 items-center'>
          <Text className='text-sm font-semibold text-gray-900'>{emptyText.title}</Text>
          <Text className='text-xs text-gray-500 mt-1'>{emptyText.subtitle}</Text>
        </View>
      )}
    </View>
  );
};
