import { useEffect, useRef, useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useApiStatusStore } from '@avoo/store';
import { servicesHooks } from '@avoo/hooks';
import { CategoryWithServicesCount, Service } from '@avoo/axios/types/apiTypes';
import CategoryFilterItem from '@/_components/CategoryFilterItem/CategoryFilterItem';
import ServiceCard from '@/_components/ServiceCard/ServiceCard';
import ConfirmationDialog from '@/_components/ConfirmationDialog/ConfirmationDialog';
import AsideModal from '@/_components/AsideModal/AsideModal';
import ServiceUpdateForm from '@/_components/ServiceUpdateForm/ServiceUpdateForm';
import { useToast } from '@/_hooks/useToast';
import DeleteIcon from '@/_icons/DeleteIcon';
import ShareIcon from '@/_icons/ShareIcon';

type Props = {
  allServicesCount: number;
  hasMore: boolean;
  currency: string;
  categorySidebarItems: CategoryWithServicesCount[] | null;
  services: Service[] | null;
  selectedCategoryId: number | null;
  selectedCategoryName: string | null;
  setSelectedCategory: (id: number | null, name: string) => void;
  incrementPage: () => void;
};

export default function ServiceList(props: Props) {
  const {
    categorySidebarItems,
    services,
    allServicesCount,
    selectedCategoryId,
    selectedCategoryName,
    setSelectedCategory,
    incrementPage,
    hasMore,
    currency,
  } = props;
  const toast = useToast();
  const listRef = useRef<HTMLDivElement>(null);

  const isPending = useApiStatusStore((state) => state.isPending);

  const [serviceIdToDelete, setServiceIdToDelete] = useState<number | null>(null);
  const { deleteServiceMutationAsync } = servicesHooks.useDeleteService();
  const isMobileOrTablet = useMediaQuery('(max-width: 1023px)');

  const { selectedService, setSelectedService } = servicesHooks.useServicesControls();

  const handleOpenDeleteDialog = (id: number) => {
    setServiceIdToDelete(id);
  };
  const handleCloseDeleteDialog = () => {
    setServiceIdToDelete(null);
  };
  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog();
    if (!serviceIdToDelete) return;
    try {
      await deleteServiceMutationAsync(serviceIdToDelete);
      toast.success('Service deleted successfully');
    } catch {
      toast.error('Failed to delete service');
    }
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el || !hasMore) return;
    if (el.scrollHeight <= el.clientHeight) {
      incrementPage();
    }
  }, [services?.length, hasMore]);

  const handleServiceClick = (service: Service) => {
    if (!isMobileOrTablet) {
      return;
    }
    setSelectedService(service);
  };

  return (
    <>
      <div className='py-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6'>
        <div className='lg:overflow-visible lg:border lg:border-gray-200 lg:gap-0 lg:rounded-lg lg:p-4 lg:overflow-x-hidden lg:h-max'>
          <Typography variant='h6' className='hidden lg:block' sx={{ mb: 2 }}>
            Categories
          </Typography>
          <ul className='flex lg:flex-col gap-4 overflow-x-auto'>
            {categorySidebarItems?.length !== 1 && (
              <li key={'all'}>
                <CategoryFilterItem
                  name='All categories'
                  count={allServicesCount}
                  isActive={selectedCategoryId === null}
                  onClick={() => setSelectedCategory(null, 'All categories')}
                />
              </li>
            )}

            {categorySidebarItems?.map((category) => (
              <li key={category.id}>
                <CategoryFilterItem
                  name={category.name}
                  count={category.totalServices}
                  isActive={
                    selectedCategoryId === category.id || categorySidebarItems?.length === 1
                  }
                  onClick={() => setSelectedCategory(category.id, category.name)}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col gap-6 overflow-y-hidden max-h-[calc(100vh-300px)]'>
          {services && services.length > 0 ? (
            <section key={selectedCategoryId}>
              <Typography variant='h6' className='hidden lg:block' sx={{ mb: 2 }}>
                {selectedCategoryName}
              </Typography>
              <div
                ref={listRef}
                className='flex flex-col overflow-y-auto gap-4 max-h-[70vh]'
                onScroll={(e) => {
                  const el = e.currentTarget;
                  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 1 && hasMore) {
                    incrementPage();
                  }
                }}
              >
                <ul className='flex flex-col gap-4  mb-30'>
                  {services.map((service) => (
                    <li key={service.id} onClick={() => handleServiceClick(service)}>
                      <ServiceCard
                        id={service.id}
                        name={service.name}
                        durationMinutes={service.durationMinutes}
                        price={service.price}
                        currency={currency}
                        isActive={service.isActive}
                        isSelected={selectedService?.id === service.id}
                        onDelete={handleOpenDeleteDialog}
                        onEdit={() => {
                          setSelectedService(service);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : isPending ? (
            <Typography variant='h1'>Loading...</Typography>
          ) : (
            <Typography variant='h1'>No services found</Typography>
          )}
        </div>
      </div>
      <ConfirmationDialog
        open={!!serviceIdToDelete}
        onClose={handleCloseDeleteDialog}
        title='Delete Service'
        content='Are you sure you want to delete this service?'
        cancelText='Cancel'
        confirmText='Delete'
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={isPending}
      />
      <AsideModal open={!!selectedService} handleClose={() => setSelectedService(null)}>
        {selectedService && (
          <div className='w-full h-full overflow-y-auto'>
            <div className='sticky top-[-1] flex items-center justify-between py-2 bg-white z-2'>
              <Typography variant='h1'>Service</Typography>
              <div className='flex flex-row gap-4 lg:hidden'>
                <div className='bg-primary-50 w-10 h-10 rounded-lg flex items-center justify-center'>
                  <IconButton aria-label='share'>
                    <ShareIcon className='transition-colors' />
                  </IconButton>
                </div>
                <div className='bg-primary-50 w-10 h-10 rounded-lg flex items-center justify-center'>
                  <IconButton
                    aria-label='delete'
                    onClick={() => {
                      handleOpenDeleteDialog(selectedService.id);
                    }}
                    loading={isPending}
                    disabled={isPending}
                  >
                    <DeleteIcon className='transition-colors' />
                  </IconButton>
                </div>
              </div>
            </div>
            <ServiceUpdateForm
              service={selectedService}
              onCancel={() => setSelectedService(null)}
            />
          </div>
        )}
      </AsideModal>
    </>
  );
}
