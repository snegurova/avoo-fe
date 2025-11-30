export enum routes {
  Home = '/',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  ForgotPassword = '/forgot-password',
  VerifyCode = '/verify-code',
  ResetPassword = '/reset-password',
  EditProfile = '/edit-profile',
  EditLanguages = '/edit-languages',
  Masters = '/masters',
  Certificates = '/certificates',
  WorkingHours = '/working-hours',
  Posts = '/posts',
  Gallery = '/gallery',
}

const validRoutes = new Set<string>(Object.values(routes));

export function isValidRoute(path: string | null): path is routes {
  if (path === null) return false;
  return validRoutes.has(path);
}
