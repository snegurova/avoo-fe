import { FileInput, UploadFile } from '@avoo/shared';
import { CreateCertificatePayload } from '@avoo/axios/types/certificate';

export async function appendFileToForm(form: FormData, key: string, file: FileInput) {
  if (file instanceof File) {
    form.append(key, file);
    return;
  }
    
  const upload = file as UploadFile;

  if (typeof window !== 'undefined') {
    const res = await fetch(upload.uri);
    const blob = await res.blob();
    form.append(key, blob, upload.name ?? 'file');
    return;
  }

  form.append(key, {
    uri: upload.uri,
    name: upload.name ?? 'file',
    type: upload.type ?? 'application/octet-stream',
  });
}

export async function buildCertificateForm(payload: CreateCertificatePayload) {
  const form = new FormData();
  if (payload.masterId !== undefined) form.append('masterId', String(payload.masterId));
  form.append('title', payload.title);
  if (payload.description) form.append('description', payload.description);
  form.append('issueDate', payload.issueDate);
  if (payload.file) await appendFileToForm(form, 'file', payload.file);
  return form;
}
