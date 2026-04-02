import { observer } from 'mobx-react';
import * as React from 'react';

import { Button, ButtonSize, ButtonTheme } from 'components/common';
import { GoToWatchPolk } from 'components/common/GoToWatchPolk';
import { PageLayout } from 'components/special';
import { ModalEnum, PanelEnum } from 'config/routes/enums';
import { useRootStore } from 'store/globals/root';
import { useHistoryStore, useStatsStore, useUserStore } from 'store/hooks';

import RegionModal from './RegionModal';
import { Support } from './Support';

import './StartPage.modules.scss';

const StartPage: React.FC = () => {
  const { push } = useHistoryStore();
  const { hasSelectedRegion } = useUserStore();
  const { sendSubmitButton } = useStatsStore();
  const { isMay7Came } = useRootStore().timerStore;

  const onGoToForm = React.useCallback(() => {
    push({ panel: PanelEnum.form });
  }, []);

  const onOpenRegionModal = React.useCallback(() => {
    void sendSubmitButton();

    if (hasSelectedRegion) {
      onGoToForm();
    } else {
      push({ panel: PanelEnum.start, modal: ModalEnum.region });
    }
  }, [sendSubmitButton, hasSelectedRegion, push, onGoToForm]);

  return (
    <PageLayout withBgImage withTopPadding={false} withBottomPadding={false}>
      <div styleName="wrapper">
        <Support styleName="support" />
        <h1 styleName="title">
          Бессмертный
          <br />
          полк онлайн
        </h1>
        <div styleName="description">
          Миллионы семей&nbsp;&mdash; одна история.
          <br />
          Присоединяйтесь к&nbsp;самому масштабному проекту в&nbsp;память о&nbsp;героях Великой
          Отечественной войны. Добавьте своих героев в&nbsp;Бессмертный полк онлайн 2025
        </div>
        {isMay7Came && <div styleName="end">Приём заявок завершен</div>}
        <div styleName="photos" />
        <div styleName="button-container">
          {isMay7Came ? (
            <GoToWatchPolk styleName="button" theme={ButtonTheme.filled} />
          ) : (
            <Button
              size={ButtonSize.standard}
              stretched
              onClick={onOpenRegionModal}
              styleName="button"
            >
              Принять участие
            </Button>
          )}
          {!isMay7Came && <div styleName="button-description">Прием заявок до&nbsp;6&nbsp;мая</div>}
        </div>
        {!hasSelectedRegion && <RegionModal onSelect={onGoToForm} />}
      </div>
    </PageLayout>
  );
};

export default observer(StartPage);
