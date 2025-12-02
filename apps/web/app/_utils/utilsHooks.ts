'use client';

import React from 'react';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const utilsHooks = {
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    onFileSelected: (file: File) => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    onFileSelected(file);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  },
};

