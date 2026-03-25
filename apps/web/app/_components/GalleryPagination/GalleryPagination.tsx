import React from 'react';

export type GalleryPaginatorProps = {
  hasMore: boolean;
  showSeeLess: boolean;
  onLoadMore: () => void;
  seeMoreText: string;
  seeLessText: string;
  children: React.ReactNode;
};

export function GalleryPagination({
  hasMore,
  showSeeLess,
  onLoadMore,
  seeMoreText,
  seeLessText,
  children,
}: Readonly<GalleryPaginatorProps>) {
  if (!hasMore && !showSeeLess) return <>{children}</>;
  return (
    <div className='flex flex-col gap-3'>
      {children}
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={onLoadMore}
          className='cursor-pointer text-12 font-medium text-gray-600 underline hover:text-primary-600'
        >
          {hasMore ? seeMoreText : seeLessText}
        </button>
      </div>
    </div>
  );
}
