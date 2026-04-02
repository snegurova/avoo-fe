import React from 'react';

export type GalleryPaginatorProps = {
  hasMore: boolean;
  showSeeLess: boolean;
  onLoadMore: () => void;
  onSeeLess?: () => void;
  seeMoreText: string;
  seeLessText: string;
  children: React.ReactNode;
};

export function GalleryPagination({
  hasMore,
  showSeeLess,
  onLoadMore,
  onSeeLess,
  seeMoreText,
  seeLessText,
  children,
}: Readonly<GalleryPaginatorProps>) {
  if (!hasMore && !showSeeLess) return <>{children}</>;
  let actionButton = null;
  if (hasMore) {
    actionButton = (
      <button
        type='button'
        onClick={onLoadMore}
        className='cursor-pointer text-12 font-medium text-gray-600 underline hover:text-primary-600'
      >
        {seeMoreText}
      </button>
    );
  } else if (showSeeLess) {
    actionButton = (
      <button
        type='button'
        onClick={onSeeLess}
        className='cursor-pointer text-12 font-medium text-gray-600 underline hover:text-primary-600'
      >
        {seeLessText}
      </button>
    );
  }
  return (
    <div className='flex flex-col gap-3'>
      {children}
      <div className='flex justify-end'>{actionButton}</div>
    </div>
  );
}
