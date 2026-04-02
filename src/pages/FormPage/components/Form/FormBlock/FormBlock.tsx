import cn from 'clsx';
import * as React from 'react';

import Divider from 'assets/img/form/divider.svg?react';

import './FormBlock.modules.scss';

type Props = DefaultProps & {
  title: string;
  description?: React.ReactNode;
  withDivider?: boolean;
};

const FormBlock: React.FC<Props> = ({
  title,
  description = null,
  children,
  className = '',
  withDivider = true,
}: Props) => {
  return (
    <>
      <div styleName="form-block" className={className}>
        <div styleName={cn('title', description && 'title_small-margin')}>{title}</div>
        {description && <div styleName="description">{description}</div>}
        {children}
      </div>
      {withDivider && <Divider styleName="divider" />}
    </>
  );
};

export default React.memo(FormBlock);
