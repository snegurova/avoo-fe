import React from 'react';
import type { NominatimPlace } from '@avoo/shared';
import { buildShortAddress } from '@avoo/shared';

type Props = {
  results: NominatimPlace[];
  onSelect: (res: NominatimPlace) => void;
};

export default function AddressResults(props: Readonly<Props>) {
  const { results, onSelect } = props;
  return (
    <div className='mt-2 bg-white border rounded shadow-sm max-h-48 overflow-auto'>
      {results.map((res, idx) => {
        const short = buildShortAddress(res);
        const label = short || res.display_name || `${res.lat},${res.lon}`;
        return (
          <button
            key={`${res.lat}-${res.lon}-${idx}`}
            type='button'
            className='w-full text-left px-3 py-2 hover:bg-gray-100'
            onClick={() => onSelect(res)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
