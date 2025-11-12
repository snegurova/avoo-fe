import { View, Text, TouchableOpacity } from 'react-native';
import { Layout } from '../shared/Layout';
import { FontAwesome } from '@expo/vector-icons';

export const HomeScreen = () => {
  const leftContent = (
    <TouchableOpacity>
      <FontAwesome name='bars' size={24} color='#007AFF' />
    </TouchableOpacity>
  );

  const titleContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FontAwesome name='home' size={20} color='#0F172A' style={{ marginRight: 8 }} />
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#0F172A' }}>Home</Text>
    </View>
  );

  const rightContent = (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity style={{ marginRight: 16 }}>
        <FontAwesome name='bell' size={24} color='#007AFF' />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome name='gear' size={24} color='#007AFF' />
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
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0F172A' }}>
          Welcome to Home! 👋
        </Text>
      </View>
    </Layout>
  );
};
