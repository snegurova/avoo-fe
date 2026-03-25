'use client';

import { useTranslations } from 'next-intl';

import { Chip } from '@mui/material';

import { ORDER_STATUS_TRANSLATION_KEY } from '@avoo/constants';
import { colors } from '@avoo/design-tokens';
import { OrderScheduleStatus, OrderStatus } from '@avoo/hooks/types/orderStatus';

type Props = {
  status: OrderStatus | OrderScheduleStatus;
};

type StatusVisuals = {
  chipSx: {
    alignSelf: string;
    backgroundColor: string;
    border?: string;
    borderRadius: string;
    color: string;
    height: number;
    '& .MuiChip-label': {
      fontSize: number;
      fontWeight: number;
      lineHeight: string;
      px: string;
    };
  };
};

function getOrderStatusVisuals(status: OrderStatus | OrderScheduleStatus): StatusVisuals {
  const labelSx = {
    fontSize: 10,
    fontWeight: 500,
    lineHeight: '10px',
    px: '6px',
  };
  const chip = {
    alignSelf: 'flex-start',
    borderRadius: '12px',
    height: 18,
    color: colors.white,
    '& .MuiChip-label': labelSx,
  };
  switch (status) {
    case OrderStatus.CONFIRMED: {
      return {
        chipSx: {
          ...chip,
          backgroundColor: colors.confirm,
        },
      };
    }
    case OrderStatus.PENDING: {
      return {
        chipSx: {
          ...chip,
          backgroundColor: colors.orange[500],
        },
      };
    }
    case OrderStatus.EXPIRED: {
      return {
        chipSx: {
          ...chip,
          backgroundColor: colors.red[500],
        },
      };
    }
    case OrderStatus.CANCELED: {
      return {
        chipSx: {
          ...chip,
          backgroundColor: colors.gray[500],
        },
      };
    }
    case OrderStatus.COMPLETED: {
      return {
        chipSx: {
          ...chip,
          backgroundColor: colors.green[500],
        },
      };
    }

    case OrderScheduleStatus.OUT_OF_SCHEDULE: {
      return {
        chipSx: {
          ...chip,
          backgroundColor: colors.red[800],
          border: `1px solid ${colors.red[800]}`,
        },
      };
    }

    default: {
      return {
        chipSx: {
          ...chip,
          backgroundColor: colors.red[900],
        },
      };
    }
  }
}

export default function OrderStatusChip(props: Props) {
  const { status: orderStatus } = props;
  const t = useTranslations('private.components.OrderStatusChip.OrderStatusChip');

  const status = ORDER_STATUS_TRANSLATION_KEY[orderStatus];

  return (
    <Chip
      key={status}
      label={t(status)}
      size='small'
      sx={getOrderStatusVisuals(orderStatus).chipSx}
    />
  );
}
