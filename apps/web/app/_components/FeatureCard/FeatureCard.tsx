import { type ComponentType, type SVGProps } from 'react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type FeatureCardProps = {
  title: string;
  description: string;
  stat: string;
  Icon: IconComponent;
};

export default function FeatureCard(props: FeatureCardProps) {
  const { title, description, stat, Icon } = props;

  return (
    <article className='rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(12,16,21,0.35)] transition-transform duration-200 hover:-translate-y-1'>
      <div className='flex items-start gap-4'>
        <div className='flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700'>
          <Icon className='size-7 fill-current' />
        </div>
        <div className='min-w-0'>
          <h3 className='text-lg font-semibold text-black'>{title}</h3>
          <p className='mt-2 text-sm leading-6 text-gray-600'>{description}</p>
          <p className='mt-4 text-sm font-medium text-gray-900'>{stat}</p>
        </div>
      </div>
    </article>
  );
}
