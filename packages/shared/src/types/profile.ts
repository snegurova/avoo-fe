import type { components } from '@avoo/axios/types/generated';

export type VisualProfileInfo = Partial<components['schemas']['BusinessInfoEntity']> & {
  avatarPreviewUrl?: components['schemas']['UserProfileEntity']['avatarPreviewUrl'];
  avatarUrl?: components['schemas']['UserProfileEntity']['avatarUrl'];
  email?: components['schemas']['UserProfileEntity']['email'];
};
