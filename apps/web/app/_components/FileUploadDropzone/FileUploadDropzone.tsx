'use client';

import React from 'react';

import { colors } from '@avoo/design-tokens';

import DragAndDropZone from '@/_components/DragAndDropZone/DragAndDropZone';
import BackupIcon from '@/_icons/BackupIcon';

type Props = {
  title: string;
  buttonTitle: string;
  onFilePicked?: (file: File | null) => void;
  onFilesPicked?: (files: File[]) => void;
  isUploading: boolean;
  description?: string;
  accept?: string;
  fileError?: string | null;
  className?: string;
  icon?: React.ReactNode;
};

export default function FileUploadDropzone({
  title,
  buttonTitle,
  onFilePicked,
  onFilesPicked,
  isUploading,
  description,
  accept = '.jpg,.png',
  fileError,
  className,
  icon,
}: Readonly<Props>) {
  return (
    <DragAndDropZone
      title={title}
      description={description}
      buttonTitle={buttonTitle}
      accept={accept}
      onFilesPicked={onFilesPicked}
      onFilePicked={onFilePicked}
      isUploading={isUploading}
      fileError={fileError ?? undefined}
      className={className}
      icon={icon ?? <BackupIcon fill={colors.primary[300]} width={60} height={60} />}
      titleClassName='mb-0'
      descriptionClassName='mt-3 mb-4 text-xs text-gray-500'
    />
  );
}
