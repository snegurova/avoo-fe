import React, { useRef } from 'react';

import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { useApiStatusStore } from '@avoo/store';

import PublicMasterCard from '@/_components/PublicMasterCard/PublicMasterCard';
import PublicOrderTitle from '@/_components/PublicOrderTitle/PublicOrderTitle';

type Props = {
  selectedMaster: MasterWithRelationsEntity | null;
  isActive: boolean;
  value: number | null;
  items: MasterWithRelationsEntity[];
  onChange: (value: { id: number }) => void;
  search: string;
  setSearch: (value: string) => void;
  hasMore?: boolean;
  fetchNextPage?: () => void;
  setStep: (step: number) => void;
  selectAnyMaster: boolean;
  setSelectAnyMaster: (value: boolean) => void;
  ref: React.Ref<HTMLDivElement>;
};

export default function PublicMasterSearch(props: Props) {
  const {
    selectedMaster,
    isActive,
    search,
    setSearch,
    hasMore,
    fetchNextPage,
    items,
    setStep,
    onChange,
    selectAnyMaster,
    setSelectAnyMaster,
    ref,
  } = props;
  const listRef = useRef<HTMLDivElement>(null);
  const isPending = useApiStatusStore((state) => state.isPending);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!listRef.current || !hasMore || !fetchNextPage || isPending) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 50) {
      fetchNextPage();
    }
  };

  const onMasterClick = (id: number) => {
    onChange({ id });
    setStep(3);
    setSelectAnyMaster(false);
  };

  const onAnyMasterClick = () => {
    setSelectAnyMaster(true);
    setStep(3);
    onChange({ id: 0 });
  };

  const onMasterClear = () => {
    onChange({ id: 0 });
    setSelectAnyMaster(false);
    setStep(2);
  };

  return (
    <div ref={ref}>
      <PublicOrderTitle
        isActive={isActive}
        title='selectMaster'
        search={search}
        setSearch={setSearch}
        placeholder='searchMasters'
      />
      {isActive && (
        <div
          className='flex flex-col gap-3 max-h-[calc(100vh-100px)] overflow-y-auto mt-4'
          ref={listRef}
          onScroll={handleScroll}
        >
          {items?.length > 1 && (
            <PublicMasterCard onClick={onAnyMasterClick} isSelected={selectAnyMaster} />
          )}
          {items.map((master) => (
            <PublicMasterCard
              key={master.id}
              master={master}
              onClick={() => onMasterClick(master.id)}
              isSelected={selectedMaster?.id === master.id}
            />
          ))}
        </div>
      )}
      {!isActive && (selectedMaster || selectAnyMaster) && (
        <PublicMasterCard
          master={selectedMaster ?? undefined}
          onClick={() => setStep(2)}
          type='change'
          onClear={onMasterClear}
        />
      )}
    </div>
  );
}
