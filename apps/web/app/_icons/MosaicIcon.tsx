import React from 'react';

export default function MosaicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 -960 960 960'
    >
      <path d='M440-140H212.31Q182-140 161-161t-21-51.31v-535.38Q140-778 161-799t51.31-21H440zm-60-60v-560H212.31q-5.39 0-8.85 3.46t-3.46 8.85v535.38q0 5.39 3.46 8.85t8.85 3.46zm140-320v-300h227.69Q778-820 799-799t21 51.31V-520zm60-60h180v-167.69q0-5.39-3.46-8.85t-8.85-3.46H580zm-60 440v-300h300v227.69Q820-182 799-161t-51.31 21zm60-60h167.69q5.39 0 8.85-3.46t3.46-8.85V-380H580zm0-180'></path>
    </svg>
  );
}
