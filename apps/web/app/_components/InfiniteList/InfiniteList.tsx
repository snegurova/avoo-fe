'use client';
import React, { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
};

export default function InfiniteList({ children, hasMore, onLoadMore, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore) return;
    if (el.scrollHeight <= el.clientHeight) {
      onLoadMore?.();
    }
  }, [children, hasMore, onLoadMore]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (!el) return;
        const { scrollTop, clientHeight, scrollHeight } = el;
        if (scrollTop + clientHeight >= scrollHeight - 1 && hasMore) {
          onLoadMore?.();
        }
      });
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [hasMore, onLoadMore]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
