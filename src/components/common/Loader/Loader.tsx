import cn from 'clsx';
import * as React from 'react';
import { createPortal } from 'react-dom';

import './Loader.modules.scss';

interface Props {
  withBackground?: boolean;
  withoutProgress?: boolean;
  dark?: boolean;
  text?: React.ReactNode;
  progressPercent?: number;
  showInPortal?: boolean;
}

const Loader: React.FC<Props> = ({ showInPortal, ...props }: Props) => {
  const loader = React.useMemo(() => {
    const { withBackground, withoutProgress, dark, text, progressPercent } = props;

    return (
      <div
        styleName={cn(
          'root',
          withBackground ? 'root_background' : 'root_default',
          dark && 'root_dark'
        )}
      >
        <div styleName="loader">
          {text && <div styleName="text">{text}</div>}
          <div styleName="line">
            {withoutProgress ? (
              <div styleName="progress progress_moving" />
            ) : (
              <div styleName="progress" style={{ width: `${progressPercent}%` }} />
            )}
          </div>
        </div>
      </div>
    );
  }, [props]);

  if (showInPortal) {
    return createPortal(loader, document.body);
  }

  return loader;
};

Loader.defaultProps = {
  withBackground: false,
};

export default Loader;
