'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import dayjs from 'dayjs';

import { FILE_UPLOAD_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { VALUE_DATE_FORMAT } from '@avoo/constants';
import { filesHooks, masterHooks, userHooks } from '@avoo/hooks';

import { CertificateFormValues, OwnerType } from '@/_hooks/types/certificateType';
import {
  DEFAULT_IMAGE_TYPES,
  DEFAULT_MAX_IMAGE_SIZE,
  getFileValidationError,
} from '@/_utils/fileUtils';

export function useCertificateForm(onClose?: () => void) {
  const t = useTranslations('private.components.CertificateAdd.CertificateAdd');
  const { handleAddCertificate } = userHooks.usePostCertificate();
  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const [fileError, setFileError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CertificateFormValues>({
    defaultValues: {
      title: '',
      description: '',
      issueDate: '',
      ownerType: OwnerType.Salon,
      masterId: null,
    },
  });

  const { handleSubmit, setValue, reset, watch } = form;

  const { uploadFileAsync, isPending: isFileUploading } = filesHooks.useUploadFile({
    onError: (error) => setFileError(error.message),
  });

  const onSubmit = async (values: CertificateFormValues) => {
    if (!file) {
      setFileError(t('uploadFileError'));
      return;
    }

    setIsUploading(true);
    const uploaded = await uploadFileAsync({
      file,
      type: FILE_UPLOAD_TYPE_ENUM.CERTIFICATE,
    }).catch(() => null);
    setIsUploading(false);

    if (!uploaded) return;

    const parsedIssueDate = new Date(values.issueDate);
    const issueDate = Number.isNaN(parsedIssueDate.getTime())
      ? values.issueDate
      : dayjs(parsedIssueDate).format(VALUE_DATE_FORMAT);

    const payload: {
      title: string;
      description?: string;
      issueDate: string;
      masterId?: number;
      url: string;
      previewUrl?: string;
    } = {
      title: values.title,
      description: values.description || undefined,
      issueDate,
      url: uploaded.url,
      previewUrl: uploaded.previewUrl,
    };

    if (values.ownerType === OwnerType.Master) {
      if (!values.masterId) {
        setFileError(t('chooseMasterError'));
        return;
      }
      payload.masterId = values.masterId;
    }

    handleAddCertificate(payload, {
      onSuccess: () => {
        reset();
        setFile(null);
        setFileError(null);
        if (onClose) onClose();
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

  return {
    form,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    watch,
    masters,
    file,
    fileError,
    onFilePicked,
    isUploading: isUploading || isFileUploading,
  };
}
