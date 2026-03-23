'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { masterHooks, userHooks } from '@avoo/hooks';
import { FileInput } from '@avoo/shared';

import { OwnerType } from '@/_components/CertificateAdd/CertificateAdd';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';
import {
  DEFAULT_IMAGE_TYPES,
  DEFAULT_MAX_IMAGE_SIZE,
  getFileValidationError,
} from '@/_utils/fileUtils';

type Values = {
  title: string;
  description: string;
  issueDate: string;
  ownerType: OwnerType;
  masterId: number | null;
};

export function useCertificateForm() {
  const t = useTranslations('private.components.CertificateAdd.CertificateAdd');
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
        setFileError(t('chooseMasterError'));
        return;
      }
      payload.masterId = values.masterId;
    }

    // require file upload
    if (!file) {
      setFileError(t('uploadFileError'));
      return;
    }

    payload.file = file;
    const sertificatesRedirect = localizationHooks.useWithLocale(AppRoutes.Certificates);
    handleAddCertificate(payload, {
      onSuccess: () => {
        reset();
        setFile(null);
        setFileError(null);
        router.push(sertificatesRedirect);
      },
    });
  };

  const onFilePicked = useCallback((f: File | null) => {
    if (!f) {
      setFile(null);
      setFileError(null);
      return;
    }

    const validationError = getFileValidationError(f, DEFAULT_IMAGE_TYPES, DEFAULT_MAX_IMAGE_SIZE, {
      unsupportedFileType: ({ types }) => t('unsupportedFileType', { types }),
      fileTooLarge: ({ maxSizeMb }) => t('fileTooLarge', { maxSizeMb }),
    });
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
