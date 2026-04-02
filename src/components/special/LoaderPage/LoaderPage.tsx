import { Panel } from '@vkontakte/vkui';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Loader } from 'components/common/Loader';

import './LoaderPage.module.scss';

const LoaderPage: React.FC = () => {
  return (
    <Panel styleName="loader-page" aria-live="polite" aria-busy>
      <Loader text="Загрузка" withBackground withoutProgress />
    </Panel>
  );
};

export default observer(LoaderPage);
