import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Layout } from '../shared/Layout';
import { FontAwesome } from '@expo/vector-icons';

export const HomeScreen = () => {
  // Левая часть хедера - кнопка меню
  const leftContent = (
    <TouchableOpacity>
      <FontAwesome name="bars" size={24} color="#007AFF" />
    </TouchableOpacity>
  );

  // Кастомный заголовок с аватаром и именем
  const titleContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <FontAwesome name="home" size={20} color="#0F172A" />
      <Text style={{ fontSize: 17, fontWeight: '600', color: '#0F172A' }}>
        Home
      </Text>
    </View>
  );

  // Правая часть хедера - уведомления и настройки
  const rightContent = (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <TouchableOpacity>
        <FontAwesome name="bell" size={24} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome name="gear" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout 
      title={titleContent}
      leftContent={leftContent}
      rightContent={rightContent}
      hasBottomTab={true}
      centerContent={true}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Welcome to Home! 👋</Text>
      </View>
    </Layout>
  );
};