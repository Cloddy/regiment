import * as React from 'react';

import TrashSVG from 'assets/img/form/trash.svg?react';

import './TrashButton.modules.scss';

interface Props {
  onClick: VoidFunction;
  className?: string;
}

const TrashButton: React.FC<Props> = ({ onClick, className }: Props) => {
  const onClickWrapper = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    },
    [onClick]
  );

  return (
    <button styleName="trash-button" className={className} onClick={onClickWrapper}>
      <TrashSVG />
    </button>
  );
};

export default React.memo(TrashButton);
