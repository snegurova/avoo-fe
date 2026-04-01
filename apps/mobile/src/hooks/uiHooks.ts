import { useState } from 'react';

import { utils } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

export const uiHooks = {
  useDatePicker(initialDate: Date, onConfirm?: () => void) {
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [tempDate, setTempDate] = useState(initialDate);
    const [isVisible, setVisible] = useState(false);

    const open = () => {
      setTempDate(selectedDate);
      setVisible(true);
    };

    const close = () => setVisible(false);

    const confirm = () => {
      setSelectedDate(tempDate);
      setVisible(false);
      onConfirm?.();
    };

    return {
      selectedDate,
      tempDate,
      setTempDate,
      isVisible,
      open,
      close,
      confirm,
      dateStr: timeUtils.formatDate(selectedDate),
      dateLabel: timeUtils.formatShortDateLabel(selectedDate),
    };
  },
  useUnsavedChanges(isDirty: boolean, onDiscard: () => void) {
    const {
      value: isConfirmVisible,
      enable: showConfirm,
      disable: hideConfirm,
    } = utils.useBooleanState(false);

    const handleClose = () => {
      if (isDirty) {
        showConfirm();
      } else {
        onDiscard();
      }
    };

    const confirmDiscard = () => {
      hideConfirm();
      onDiscard();
    };

    return {
      handleClose,
      isConfirmVisible,
      confirmDiscard,
      cancelDiscard: hideConfirm,
    };
  },
};
