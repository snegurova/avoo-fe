import React from 'react';

type Props = { userId: number };

export default function SalonPageCertificatesTab(props: Props) {
  const { userId } = props;

  return (
    <div className='flex justify-center items-center py-8 flex-1'>
      {userId && (
        <p className='max-w-150 text-center'>
          This is the certificates tab. Here we will display the salon's certificates and awards,
          showcasing their expertise and commitment to excellence in the beauty industry. Stay tuned
          for updates as we gather and share the salon's achievements!
        </p>
      )}
    </div>
  );
}
