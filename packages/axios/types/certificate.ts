import { FileInput } from '@avoo/shared';

export type CreateCertificatePayload = {
  title: string;
  issueDate: string;
  description?: string;
  masterId?: number;
  file?: FileInput;
};
