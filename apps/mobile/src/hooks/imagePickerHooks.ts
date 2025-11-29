import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { permissionsHooks } from './permissionsHooks';
import { UploadFile } from '@avoo/axios/types/apiTypes';
import {
  ImagePickerOptions,
  MediaType,
  pickImageOptions,
  Source,
} from '../types/imagePicker';

const defaultOptions: ImagePickerOptions = {
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
  mediaTypes: MediaType.Images,
};

export const imagePickerHooks = {
  pickImage: async (props: pickImageOptions): Promise<UploadFile | null> => {
    const { source, options } = props;

    const hasPermission = await permissionsHooks.requestPermissions();
    if (!hasPermission) return null;

    const pickerOptions = { ...defaultOptions, ...options };

    let result: ImagePicker.ImagePickerResult | null = null;

    if (source === Source.Camera) {
      result = await ImagePicker.launchCameraAsync(pickerOptions);
    } 

    if (source === Source.Gallery) {
      result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    }

    if (!result || result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      type: asset.mimeType,
      name: asset.fileName,
    };
  },
  showImagePicker: async (
    onImageSelected: (file: UploadFile) => void,
    options: ImagePickerOptions = {},
  ) => {
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const file = await imagePickerHooks.pickImage({ source: Source.Camera, options });
            if (file) onImageSelected(file);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const file = await imagePickerHooks.pickImage({ source: Source.Gallery, options });
            if (file) onImageSelected(file);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  },
};

