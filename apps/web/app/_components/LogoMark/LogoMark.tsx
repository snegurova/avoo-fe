import { useTranslations } from 'next-intl';

export default function LogoMark() {
  const tCommon = useTranslations('common');
  return (
    <span className='font-semibold text-4xl text-gray-600 inline-flex items-center font-advent-pro text-center'>
      {tCommon('avoo')}
    </span>
  );
}
