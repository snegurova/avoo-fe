'use client';

import React from 'react';

export const utilsHooks = {
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    onFileSelected: (file: File) => void,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onFileSelected(file);
  },
  getInitials: (name: string) => {
    return name.charAt(0).toUpperCase();
  },
};
