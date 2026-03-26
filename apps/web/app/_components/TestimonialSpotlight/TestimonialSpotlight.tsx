export type ReviewSlide = {
  quote: string;
  author: string;
  role: string;
  company: string;
  imageSrc: string;
  imageAlt: string;
};

type TestimonialSpotlightProps = {
  badge: string;
  imageSrc: string;
  imageAlt: string;
};

export default function TestimonialSpotlight(props: TestimonialSpotlightProps) {
  const { badge, imageSrc, imageAlt } = props;

  return (
    <div className='relative min-h-88 overflow-hidden rounded-4xl border border-primary-100 bg-white shadow-[0_35px_85px_-55px_rgba(160,99,196,0.75)] sm:min-h-120'>
      <img alt={imageAlt} src={imageSrc} className='absolute inset-0 h-full w-full object-cover' />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(12,16,21,0.15)_100%)]' />

      <div className='relative h-full p-6 sm:p-8'>
        <div className='inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-gray-500 backdrop-blur'>
          {badge}
        </div>
      </div>
    </div>
  );
}
