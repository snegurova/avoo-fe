import * as ImagePicker from 'expo-image-picker';

export enum MediaType {
  Images = 'images',
}

export type ImagePickerOptions = {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  mediaTypes?: ImagePicker.MediaType;
};

export enum Source {
  Camera = 'camera',
  Gallery = 'gallery',
}

export type SourceType = Source.Camera | Source.Gallery;

export type pickImageOptions = {
  source: SourceType;
  options: ImagePickerOptions;
};

