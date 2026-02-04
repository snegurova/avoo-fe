export function getFileValidationError(
  file: File | null,
  allowedTypes: string[],
  maxSizeBytes: number,
): string | null {
  if (!file) return null;

  if (!allowedTypes.includes(file.type)) {
    return (
      'Unsupported file type. Use: ' + allowedTypes.map((t) => t.split('/')[1]).join(', ') + '.'
    );
  }

  if (file.size > maxSizeBytes) {
    return 'File is too large. Max ' + Math.round(maxSizeBytes / (1024 * 1024)) + 'MB.';
  }

  return null;
}

export const DEFAULT_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const DEFAULT_MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
