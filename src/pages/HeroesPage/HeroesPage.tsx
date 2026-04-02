import { observer } from 'mobx-react-lite';
import * as React from 'react';

import IconPlus from 'assets/img/common/plus.svg?react';
import { Button, ButtonTheme } from 'components/common';
import { GoToWatchPolk } from 'components/common/GoToWatchPolk';
import { PageLayout } from 'components/special';
import { PanelEnum } from 'config/routes/enums';
import { useRootStore } from 'store/globals/root';
import { useHeroesStore, useHistoryStore } from 'store/hooks';

import { HeroCard } from './components';

import './HeroesPage.module.scss';

const HeroesPage: React.FC = () => {
  const { push } = useHistoryStore();
  const { loadHeroes, heroes } = useHeroesStore();
  const { isMay7Came } = useRootStore().timerStore;

  const handleAddHero = React.useCallback(() => {
    push({ panel: PanelEnum.form });
  }, []);

  React.useEffect(() => {
    void loadHeroes();
  }, []);

  return (
    <PageLayout withFooter withSidePadding>
      <h1 styleName="title">Мои герои</h1>
      {isMay7Came ? (
        <GoToWatchPolk theme={ButtonTheme.filled} styleName="button" />
      ) : (
        <Button
          styleName="button"
          stretched
          before={<IconPlus styleName="button__icon" />}
          onClick={handleAddHero}
        >
          Добавить героя
        </Button>
      )}
      <div styleName="heroes-list">
        {heroes.map((hero) => (
          <HeroCard
            key={hero.id}
            hero={hero.cardPreview}
            setStatus={hero.setStatus}
            setProblems={hero.setProblems}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default observer(HeroesPage);
