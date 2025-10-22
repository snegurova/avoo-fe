import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Layout } from '../shared/Layout';
import Button from '../shared/Button';
import { useAuthStore } from '../store/useAuthStore';
import { BottomBarStackParamList, ProfileStackParamList, RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';

export const ExampleScreensParams = () => {
    const { params } = useRoute<RouteProp<ProfileStackParamList, 'ExampleScreensParams'>>();
   
   
    return (
        <Layout title={`Example Screens Params`} centerContent={true} showBack={true}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Example Screens Params {params?.id ?? 'No params'}</Text>
            </View>
        </Layout>
    );
};
