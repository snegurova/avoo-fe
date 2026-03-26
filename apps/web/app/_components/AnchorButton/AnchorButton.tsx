import { type MouseEventHandler, type ReactNode } from 'react';

import { tv, type VariantProps } from 'tailwind-variants';

const anchorButton = tv({
  base: 'inline-flex h-12 shrink-0 items-center justify-center rounded-lg border px-6 text-sm font-medium whitespace-nowrap transition-colors',
  variants: {
    variant: {
      primary:
        'bg-black text-white hover:bg-primary-500 !border !border-black !duration-300 hover:!border-primary-500 focus:!border-primary-500',
      secondary: 'border-black bg-white text-black hover:bg-gray-50',
    },
  },
  defaultVariants: {
    variant: 'secondary',
  },
});

type AnchorButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
} & VariantProps<typeof anchorButton>;

export default function AnchorButton(props: AnchorButtonProps) {
  const { href, children, variant = 'secondary', className, onClick } = props;

  return (
    <a href={href} onClick={onClick} className={anchorButton({ variant, className })}>
      {children}
    </a>
  );
}
