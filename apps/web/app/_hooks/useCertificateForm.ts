'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AppRoutes } from '@/_routes/routes';
import { userHooks, masterHooks } from '@avoo/hooks';
import {
  getFileValidationError,
  DEFAULT_IMAGE_TYPES,
  DEFAULT_MAX_IMAGE_SIZE,
} from '@/_utils/fileUtils';
import { FileInput } from '@avoo/shared';
import { OwnerType } from '@/_components/CertificateAdd/CertificateAdd';
import { localizationHooks } from '@/_hooks/localizationHooks';

type Values = {
  title: string;
  description: string;
  issueDate: string;
  ownerType: OwnerType;
  masterId: number | null;
};

export function useCertificateForm() {
  const router = useRouter();
  const { handleAddCertificate } = userHooks.usePostCertificate();
  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const [fileError, setFileError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<Values>({
    defaultValues: {
      title: '',
      description: '',
      issueDate: '',
      ownerType: OwnerType.Salon,
      masterId: null,
    },
  });

  const { handleSubmit, setValue, reset, watch } = form;

  const onSubmit = (values: Values) => {
    const payload: {
      title: string;
      description?: string;
      issueDate: string;
      masterId?: number;
      file?: FileInput;
    } = {
      title: values.title,
      description: values.description || undefined,
      issueDate: values.issueDate,
    };

    if (values.ownerType === OwnerType.Master) {
      if (!values.masterId) {
        setFileError('Please choose a master');
        return;
      }
      payload.masterId = values.masterId;
    }

    // require file upload
    if (!file) {
      setFileError('Please upload a file');
      return;
    }

    payload.file = file;

    handleAddCertificate(payload, {
      onSuccess: () => {
        reset();
        setFile(null);
        setFileError(null);
        router.push(localizationHooks.useWithLocale(AppRoutes.Certificates));
      },
    });
  };

  const onFilePicked = useCallback((f: File | null) => {
    if (!f) {
      setFile(null);
      setFileError(null);
      return;
    }

    const validationError = getFileValidationError(f, DEFAULT_IMAGE_TYPES, DEFAULT_MAX_IMAGE_SIZE);
    if (validationError) {
      setFile(null);
      setFileError(validationError);
      return;
    }

    setFileError(null);
    setFile(f);
  }, []);

  const onCancel = useCallback(() => router.back(), [router]);

  return {
    form,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    masters,
    file,
    fileError,
    onFilePicked,
    onCancel,
  };
}
