export type PhoneCodeOption = { label: string; value: string };

export const PHONE_CODE_OPTIONS: PhoneCodeOption[] = [
  { label: '+31', value: '+31' },
  { label: '+32', value: '+32' },
  { label: '+33', value: '+33' },
  { label: '+34', value: '+34' },
  { label: '+36', value: '+36' },
  { label: '+37', value: '+37' },
  { label: '+38', value: '+38' },
  { label: '+39', value: '+39' },
  { label: '+40', value: '+40' },
  { label: '+42', value: '+42' },
  { label: '+43', value: '+43' },
  { label: '+44', value: '+44' },
  { label: '+45', value: '+45' },
  { label: '+46', value: '+46' },
  { label: '+48', value: '+48' },
  { label: '+49', value: '+49' },
];

export const PHONE_CODE_LABELS = PHONE_CODE_OPTIONS.reduce<Record<string, string>>((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {});

export default PHONE_CODE_OPTIONS;
