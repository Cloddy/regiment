import cx from 'clsx';
import * as React from 'react';

import { SCROLL_CONTAINER_ID } from 'config/ui';

import { PanelHeader, Footer } from './ui';

import './PageLayout.module.scss';

type Props = DefaultProps & {
  withTopPadding?: boolean;
  withBottomPadding?: boolean;
  withFooter?: boolean;
  withBgImage?: boolean;
  withSidePadding?: boolean;
};

const PageLayout: React.FC<Props> = ({
  withBottomPadding = true,
  withTopPadding = true,
  withFooter = true,
  withBgImage = false,
  withSidePadding = false,
  children,
  className,
}) => {
  return (
    <div styleName={cx('page-layout', withBgImage && 'bg-image')} id={SCROLL_CONTAINER_ID}>
      <PanelHeader />
      <div
        styleName={cx(
          'page-content',

          withBottomPadding && 'with-bottom-padding',
          withSidePadding && 'with-side-padding',
          withTopPadding && 'with-top-padding'
        )}
        className={className}
      >
        {children}
      </div>
      {withFooter && <Footer />}
    </div>
  );
};

export default React.memo(PageLayout);
