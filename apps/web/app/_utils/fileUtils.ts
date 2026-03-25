type FileValidationMessages = {
  unsupportedFileType: (params: { types: string }) => string;
  fileTooLarge: (params: { maxSizeMb: number }) => string;
};

export function getFileValidationError(
  file: File | null,
  allowedTypes: string[],
  maxSizeBytes: number,
  messages: FileValidationMessages,
): string | null {
  if (!file) return null;

  if (!allowedTypes.includes(file.type)) {
    return messages.unsupportedFileType({
      types: allowedTypes.map((type) => type.split('/')[1]).join(', '),
    });
  }

  if (file.size > maxSizeBytes) {
    return messages.fileTooLarge({
      maxSizeMb: Math.round(maxSizeBytes / (1024 * 1024)),
    });
  }

  return null;
}

export const DEFAULT_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const DEFAULT_MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
