import { memo } from 'react';

type Props = {
  value: boolean;
  toggle: () => void;
};

const ShowPasswordToggler = memo((props: Props) => {
  const { value, toggle } = props;

  return (
    <button type='button' onClick={toggle}>
      {value ? <p>👁️</p> : <p>🫣</p>}
    </button>
  );
});

ShowPasswordToggler.displayName = 'ShowPasswordToggler';

export default ShowPasswordToggler;

