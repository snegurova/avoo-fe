import { utils } from '@avoo/hooks';

export const uiHooks = {
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
