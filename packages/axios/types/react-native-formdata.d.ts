import { FileInput } from '@avoo/shared';

declare global {
  interface FormData {
    append(name: string, value: string | Blob | FileInput, fileName?: string): void;
  }
}

