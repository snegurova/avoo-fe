import { Typography } from '@mui/material';
import CategoryFilterItem from '../CategoryFilterItem/CategoryFilterItem';
import ServiceCard from '../ServiceCard/ServiceCard';
import { Category, Service } from '@avoo/axios/types/apiTypes';
import { useApiStatusStore } from '@avoo/store';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import { useState } from 'react';
import { servicesHooks } from '@avoo/hooks';

type Props = {
  allServicesCount: number;
  totalServicesCount: number;
  hasMore: boolean;
  currency: string;
  categorySidebarItems: Category[] | null;
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
    totalServicesCount,
    selectedCategoryId,
    selectedCategoryName,
    setSelectedCategory,
    incrementPage,
    hasMore,
    currency,
  } = props;
  const isPending = useApiStatusStore((state) => state.isPending);

  const [serviceIdToDelete, setServiceIdToDelete] = useState<number | null>(null);
  const { deleteServiceMutationAsync } = servicesHooks.useDeleteService();

  const handleOpenDeleteDialog = (id: number) => {
    setServiceIdToDelete(id);
  };
  const handleCloseDeleteDialog = () => {
    setServiceIdToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (!serviceIdToDelete) return;
    try {
      await deleteServiceMutationAsync(serviceIdToDelete);
    } catch {
      alert('Failed to delete service');
    }
    handleCloseDeleteDialog();
  };

  return (
    <>
      <div className='p-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6'>
        <div className='lg:overflow-visible lg:border lg:border-gray-200 lg:gap-0 lg:rounded-lg lg:p-4 lg:overflow-x-hidden lg:h-max'>
          <Typography variant='h6' className='hidden lg:block' sx={{ mb: 2 }}>
            Categories
          </Typography>
          <ul className='flex lg:flex-col gap-4 overflow-x-auto'>
            <li key={'all'}>
              <CategoryFilterItem
                name='All categories'
                count={allServicesCount}
                isActive={selectedCategoryId === null}
                onClick={() => setSelectedCategory(null, 'All categories')}
              />
            </li>

            {categorySidebarItems?.map((category) => (
              <li key={category.id}>
                <CategoryFilterItem
                  name={category.name}
                  count={selectedCategoryId === category.id ? totalServicesCount : 0}
                  isActive={selectedCategoryId === category.id}
                  onClick={() => setSelectedCategory(category.id, category.name)}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-300px)]'>
          {services && services.length > 0 ? (
            <section key={selectedCategoryId}>
              <Typography variant='h6' className='hidden lg:block' sx={{ mb: 2 }}>
                {selectedCategoryName}
              </Typography>
              <div
                className='flex flex-col gap-4 overflow-y-auto max-h-[70vh]'
                onScroll={(e) => {
                  const target = e.currentTarget;
                  if (target.scrollHeight - target.scrollTop === target.clientHeight && hasMore) {
                    incrementPage();
                  }
                }}
              >
                <ul className='flex flex-col gap-4'>
                  {services.map((service) => (
                    <li key={service.id} className={service.id.toString()}>
                      <ServiceCard
                        id={service.id}
                        name={service.name}
                        durationMinutes={service.durationMinutes}
                        price={service.price}
                        currency={currency}
                        onDelete={handleOpenDeleteDialog}
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
    </>
  );
}
