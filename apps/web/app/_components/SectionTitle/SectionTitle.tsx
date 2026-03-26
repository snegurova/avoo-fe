type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
};

export default function SectionTitle(props: SectionTitleProps) {
  const { eyebrow, title, description, align = 'left' } = props;
  const isCentered = align === 'center';

  return (
    <div className={isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <p className='mb-4 text-xs font-medium uppercase tracking-[0.3em] text-primary-700'>
          {eyebrow}
        </p>
      ) : null}
      <h2 className='text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.04em] text-black sm:text-[2.5rem] lg:text-[3.25rem]'>
        {title}
      </h2>
      {description ? (
        <p className='mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg'>{description}</p>
      ) : null}
    </div>
  );
}
