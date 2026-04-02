import { Panel } from '@vkontakte/vkui';
import cn from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { type VKPanelConfigProps } from 'config/routes/types';

import { withErrorBoundary } from '../ErrorBoundary';

import './VKPanel.module.scss';

type VKPanelProps = {
  id: string;
  children: React.ReactElement;
  config: VKPanelConfigProps;
};

const VKPanel: React.FC<VKPanelProps> = ({
  children,
  id,
  config: { fixedHeight = false } = {},
}) => (
  <Panel id={id} styleName={cn('vk-panel', fixedHeight && 'vk-panel_fixed-height')}>
    <div styleName="background" />
    <div styleName="page">{children}</div>
  </Panel>
);

export default withErrorBoundary(observer(VKPanel));
