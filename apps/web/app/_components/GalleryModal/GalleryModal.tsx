import React, { useEffect, useRef, useState } from 'react';

import { tv } from 'tailwind-variants';

import { useBodyScrollLock } from '@/_hooks/useBodyScrollLock';
import ArrowReturnBackIcon from '@/_icons/ArrowReturnBackIcon';
import CloseIcon from '@/_icons/CloseIcon';

const thumbnail = tv({
  base: 'border-2 rounded-lg h-14 w-14 md:h-25 md:w-25 p-0.5 cursor-pointer transition-opacity',
  variants: {
    active: {
      true: 'border-black gallery-thumb-active',
      false: 'border-transparent opacity-70 hover:opacity-100 focus:opacity-100',
    },
  },
});

const thumbnailImage = tv({
  base: 'h-full w-full',
  variants: {
    fullImages: {
      true: 'object-contain',
      false: 'object-cover rounded-md',
    },
  },
});

const imageWrapper = tv({
  base: 'relative flex-1 md:aspect-video w-full overflow-hidden min-h-[60vh]',
  variants: {
    fullImages: {
      true: '',
      false: 'md:rounded-lg',
    },
  },
});

const image = tv({
  base: 'object-center h-full w-full',
  variants: {
    fullImages: {
      true: 'object-contain',
      false: 'object-cover',
    },
  },
});

const modal = tv({
  base: 'relative bg-white md:rounded-[18px] w-full h-full md:w-[calc(100%-1rem)] xl:w-[calc(100%-10rem)] md:h-[calc(100%-2rem)] max-w-7xl pb-5 md:p-11 flex flex-col items-center gap-4 xl:gap-6 overflow-auto',
  variants: {
    withImages: {
      true: '',
      false: 'justify-center',
    },
  },
});

type Props = {
  images?: { url: string }[];
  initialIndex?: number;
  onClose?: () => void;
  onIndexChange?: (index: number) => void;
  children?: React.ReactNode;
  fullImages?: boolean;
};

export default function GalleryModal(props: Props) {
  const { images, initialIndex = 0, onClose, onIndexChange, children, fullImages = false } = props;
  const [current, setCurrent] = useState(initialIndex);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const imageAreaRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useBodyScrollLock(true);

  useEffect(() => {
    if (!thumbnailsRef.current) return;
    const container = thumbnailsRef.current;
    const active = container.querySelector('.gallery-thumb-active');
    if (active && container) {
      const activeEl = active as HTMLElement;
      const scrollLeft =
        activeEl.offsetLeft -
        container.offsetLeft -
        container.clientWidth / 2 +
        activeEl.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [current]);

  useEffect(() => {
    const area = imageAreaRef.current;
    if (!area || !images) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
      if (touchStartX.current !== null && touchEndX.current !== null) {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && current < images.length - 1) {
            updateIndex(current + 1);
          } else if (diff < 0 && current > 0) {
            updateIndex(current - 1);
          }
        }
      }
      touchStartX.current = null;
      touchEndX.current = null;
    };

    area.addEventListener('touchstart', handleTouchStart);
    area.addEventListener('touchmove', handleTouchMove);
    area.addEventListener('touchend', handleTouchEnd);
    return () => {
      area.removeEventListener('touchstart', handleTouchStart);
      area.removeEventListener('touchmove', handleTouchMove);
      area.removeEventListener('touchend', handleTouchEnd);
    };
  }, [current, images?.length]);

  const updateIndex = (newIndex: number) => {
    setCurrent(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  };

  const handlePrev = () => {
    updateIndex(current > 0 ? current - 1 : current);
  };

  const handleNext = () => {
    if (!images) return;
    updateIndex(current < images.length - 1 ? current + 1 : current);
  };

  const handleThumbnailClick = (idx: number) => {
    updateIndex(idx);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
      onClick={handleOverlayClick}
    >
      <div className={modal({ withImages: !!images })}>
        {onClose && (
          <button
            className='absolute top-3 right-3 md:top-1.5 md:right-1.5 cursor-pointer w-11 h-11  rounded-full transition-colors hover:bg-gray-100 focus:bg-gray-100 flex items-center justify-center z-1 bg-white '
            onClick={onClose}
            aria-label='Close'
          >
            <CloseIcon className='fill-black' />
          </button>
        )}
        {images && (
          <div
            className={imageWrapper({ fullImages })}
            ref={imageAreaRef}
            style={{ touchAction: 'pan-y' }}
          >
            <button
              className='disabled:opacity-30 absolute left-5.5 cursor-pointer top-1/2 -translate-y-1/2 rounded-full bg-white border border-black transition-colors hover:bg-gray-100 focus:bg-gray-100 w-11 h-11 flex items-center justify-center'
              onClick={handlePrev}
              disabled={current === 0}
              aria-label='Previous image'
            >
              <ArrowReturnBackIcon className='2xl:w-7 2xl:h-7' />
            </button>
            <img
              src={images[current].url}
              alt={`Image ${current + 1}`}
              className={image({ fullImages })}
            />
            <button
              className='disabled:opacity-30 absolute right-5.5 cursor-pointer top-1/2 -translate-y-1/2 rounded-full bg-white border border-black transition-colors hover:bg-gray-100 focus:bg-gray-100 w-11 h-11 flex items-center justify-center'
              onClick={handleNext}
              disabled={current === images.length - 1}
              aria-label='Next image'
            >
              <ArrowReturnBackIcon className='rotate-180 2xl:w-7 2xl:h-7' />
            </button>
          </div>
        )}
        {images && (
          <div
            className='flex gap-0.5 md:gap-1.5 overflow-x-auto w-full px-2 shrink-0'
            ref={thumbnailsRef}
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {images.map((img, idx) => (
              <button
                key={img.url + idx}
                className={thumbnail({ active: idx === current })}
                onClick={() => handleThumbnailClick(idx)}
                aria-label={`Show image ${idx + 1}`}
                style={{ scrollSnapAlign: 'center', flex: '0 0 auto' }}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className={thumbnailImage({ fullImages })}
                />
              </button>
            ))}
          </div>
        )}
        {children && <div className='w-full'>{children}</div>}
      </div>
    </div>
  );
}
