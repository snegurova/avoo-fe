import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Combination } from '@avoo/axios/types/apiTypes';
import { combinationHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import AsideModal from '@/_components/AsideModal/AsideModal';
import ComboServiceCard from '@/_components/ComboServiceCard/ComboServiceCard';
import ComboServiceUpdateForm from '@/_components/ComboServiceUpdateForm/ComboServiceUpdateForm';
import ConfirmationDialog from '@/_components/ConfirmationDialog/ConfirmationDialog';
import { useToast } from '@/_hooks/useToast';
import DeleteIcon from '@/_icons/DeleteIcon';
import ShareIcon from '@/_icons/ShareIcon';

type Props = {
  hasMore: boolean;
  combinations: Combination[] | null;
  incrementPage: () => void;
};

export default function ComboServiceList(props: Props) {
  const t = useTranslations('private.components.ComboServiceList.ComboServiceList');
  const { combinations, incrementPage, hasMore } = props;
  const toast = useToast();
  const listRef = useRef<HTMLDivElement>(null);
  const isMobileOrTablet = useMediaQuery('(max-width: 1023px)');

  const isPending = useApiStatusStore((state) => state.isPending);

  const { deleteCombinationMutationAsync } = combinationHooks.useDeleteCombination();

  const {
    selectedCombination,
    setSelectedCombination,
    combinationToDelete,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
  } = combinationHooks.useCombinationControls();

  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog();
    if (!combinationToDelete) return;
    try {
      await deleteCombinationMutationAsync(combinationToDelete);
      toast.success(t('deleteSuccess'));
    } catch {
      toast.error(t('deleteError'));
    }
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el || !hasMore) return;
    if (el.scrollHeight <= el.clientHeight) {
      incrementPage();
    }
  }, [combinations?.length, hasMore]);

  const handleCombinationClick = (combination: Combination) => {
    if (!isMobileOrTablet) {
      return;
    }
    setSelectedCombination(combination);
  };

  return (
    <>
      <div className='overflow-y-hidden max-h-[calc(100vh-300px)]'>
        {combinations && combinations.length > 0 ? (
          <div id='combo-service-list' className='overflow-y-auto max-h-[70vh]'>
            <ul className='flex flex-col gap-4 mb-30'>
              {combinations.map((combination) => (
                <li key={combination.id} onClick={() => handleCombinationClick(combination)}>
                  <ComboServiceCard
                    id={combination.id}
                    name={combination.name}
                    durationMinutes={combination.durationMinutes}
                    isActive={combination.isActive}
                    isSelected={selectedCombination?.id === combination.id}
                    services={combination.services}
                    onDelete={handleOpenDeleteDialog}
                    onEdit={() => {
                      setSelectedCombination(combination);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : isPending ? (
          <Typography variant='h1'>{t('loading')}</Typography>
        ) : (
          <Typography variant='h1'>{t('noComboFound')}</Typography>
        )}
      </div>

      <ConfirmationDialog
        open={!!combinationToDelete}
        onClose={handleCloseDeleteDialog}
        title={t('deleteComboService')}
        content={t('deleteConfirmContent')}
        cancelText={t('cancel')}
        confirmText={t('delete')}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={isPending}
      />
      <AsideModal open={!!selectedCombination} handleClose={() => setSelectedCombination(null)}>
        {selectedCombination && (
          <div className='w-full h-full flex flex-col overflow-y-auto overflow-x-hidden'>
            <div className='sticky top-[-1] flex items-center justify-between py-2 bg-white z-2'>
              <Typography variant='h1'>{t('comboServiceTime')}</Typography>
              <div className='flex flex-row gap-4 lg:hidden'>
                <div className='bg-primary-50 w-10 h-10 rounded-lg flex items-center justify-center'>
                  <IconButton aria-label={t('shareSm')}>
                    <ShareIcon className='transition-colors' />
                  </IconButton>
                </div>
                <div className='bg-primary-50 w-10 h-10 rounded-lg flex items-center justify-center'>
                  <IconButton
                    aria-label={t('deleteSm')}
                    onClick={() => {
                      handleOpenDeleteDialog(selectedCombination.id);
                    }}
                    loading={isPending}
                    disabled={isPending}
                  >
                    <DeleteIcon className='transition-colors' />
                  </IconButton>
                </div>
              </div>
            </div>
            <ComboServiceUpdateForm
              combination={selectedCombination}
              onCancel={() => setSelectedCombination(null)}
            />
          </div>
        )}
      </AsideModal>
    </>
  );
}
