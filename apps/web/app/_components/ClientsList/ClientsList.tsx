'use client';

import React from 'react';
import { IconButton } from '@/_components/IconButton/IconButton';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';
import { customerHooks } from '@avoo/hooks';

type Props = {
  onEdit: (id: number) => void;
};

export const ClientsList: React.FC<Props> = ({ onEdit }) => {
  const customers = customerHooks.useGetCustomers();
  const [sortAsc, setSortAsc] = React.useState<boolean | null>(null);

  const sorted = React.useMemo(() => {
    if (!customers) return [];
    if (sortAsc === null) return customers;
    return [...customers].sort((a, b) => {
      const an = (a.name || '').toLowerCase();
      const bn = (b.name || '').toLowerCase();
      if (an < bn) return sortAsc ? -1 : 1;
      if (an > bn) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [customers, sortAsc]);

  // Table view (desktop)
  const Table = (
    <table className='min-w-full hidden md:table'>
      <thead className='bg-gray-50'>
        <tr>
          <th className='text-left px-6 py-4'>
            <div className='flex items-center gap-2'>
              <span>Client name</span>
              <div className='flex flex-col'>
                <button
                  aria-label='sort-asc'
                  onClick={() => setSortAsc(true)}
                  className='text-sm text-gray-400 hover:text-gray-700'
                >
                  <ArrowUpIcon />
                </button>
                <button
                  aria-label='sort-desc'
                  onClick={() => setSortAsc(false)}
                  className='text-sm text-gray-400 hover:text-gray-700'
                >
                  <ArrowDownIcon />
                </button>
              </div>
            </div>
          </th>
          <th className='text-left px-6 py-4'>Mobile number</th>
          <th className='text-left px-6 py-4'>Email address</th>
          <th className='text-left px-6 py-4'>Last visit</th>
          <th className='px-6 py-4' />
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={5} className='text-center py-8 text-gray-500'>
              No clients
            </td>
          </tr>
        ) : (
          sorted.map((c) => (
            <tr key={c.id} className='border-t'>
              <td className='px-6 py-4 flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-medium'>
                  {c.name
                    ? c.name
                        .split(' ')
                        .map((s) => s[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'NA'}
                </div>
                <div>{c.name}</div>
              </td>
              <td className='px-6 py-4'>{c.phone}</td>
              <td className='px-6 py-4'>{c.email}</td>
              <td className='px-6 py-4 text-sm text-gray-600'>-</td>
              <td className='px-6 py-4 text-right'>
                <IconButton
                  icon='✏️'
                  ariaLabel={`Edit ${c.name ?? 'client'}`}
                  onClick={() => onEdit(c.id)}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  // Cards view (mobile)
  const Cards = (
    <div className='flex flex-col gap-4 md:hidden'>
      {sorted.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>No clients</div>
      ) : (
        sorted.map((c) => (
          <div key={c.id} className='border rounded-md p-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-medium'>
                {c.name
                  ? c.name
                      .split(' ')
                      .map((s) => s[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'NA'}
              </div>
              <div>
                <div className='font-medium'>{c.name}</div>
                <div className='text-sm text-gray-600'>
                  {c.phone} • {c.email}
                </div>
              </div>
            </div>
            <div>
              <IconButton
                icon='✏️'
                ariaLabel={`Edit ${c.name ?? 'client'}`}
                onClick={() => onEdit(c.id)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div>
      <div className='overflow-x-auto bg-white rounded-md'>{Table}</div>
      <div className='mt-4'>{Cards}</div>
    </div>
  );
};
