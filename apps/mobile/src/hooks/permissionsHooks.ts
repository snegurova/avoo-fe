import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PermissionStatus } from 'expo-image-picker';

export const permissionsHooks = {
  requestPermissions: async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== PermissionStatus.GRANTED || mediaStatus !== PermissionStatus.GRANTED) {
      Alert.alert('Permission required', 'We need camera and gallery permissions to upload photos');
      return false;
    }

    return true;
  },
};
