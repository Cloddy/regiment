import cn from 'clsx';
import * as React from 'react';

import './SelectorItem.module.scss';

type Props = {
  name: string;
  onClick?: VoidFunction;
  selected?: boolean;
  empty?: boolean;
};

const SelectorItem = ({ name, onClick, selected, empty }: Props) => {
  return (
    <div
      onClick={onClick}
      styleName={cn(
        'selector-item',
        selected && 'selector-item_selected',
        empty && 'selector-item_empty'
      )}
    >
      {name}
    </div>
  );
};

export default React.memo(SelectorItem);
