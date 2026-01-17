import { useCallback, useState } from 'react';

type UseAvatarUploadOptions = {
  initialPreview?: string | null;
  upload?: (file: File) => Promise<unknown>;
};

export function useAvatarUpload(opts?: UseAvatarUploadOptions) {
  const { initialPreview = null, upload } = opts ?? {};
  const [localPreview, setLocalPreview] = useState<string | null>(initialPreview);

  const handleImageSelected = useCallback(
    (file: File) => {
      setLocalPreview(URL.createObjectURL(file));
      if (upload) void upload(file).catch(() => null);
    },
    [upload],
  );

  return { localPreview, handleImageSelected } as const;
}

export default useAvatarUpload;
