import cx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { COMMON_IMAGES } from 'assets/img/common';
// import EditIcon from 'assets/img/heroes/edit.svg?react';
// import WarningIcon from 'assets/img/heroes/warning.svg?react';
import { Button, ButtonSize, ButtonTheme } from 'components/common';
import { GoToWatchPolk } from 'components/common/GoToWatchPolk';
import { militaryBranches } from 'config/militaryBranch';
// import { PanelEnum } from 'config/routes/enums';
import { heroStatuses, StatusEnum } from 'config/statuses';
import { DeclineReasonTypeEnum } from 'entities/declineReason';
import { HeroCardPreview } from 'entities/hero';
import { useAppParamsStore, useLocalStore, useStatsStore } from 'store/hooks';
import { ShareStore } from 'store/locals/ShareStore';

import './HeroCard.module.scss';

type Props = {
  hero: HeroCardPreview;
  setStatus: (status: StatusEnum) => void;
  setProblems: (problems: DeclineReasonTypeEnum[]) => void;
};

const HeroCard: React.FC<Props> = ({ hero, setStatus, setProblems }) => {
  // const { push } = useHistoryStore();
  const { userInWhitelist } = useAppParamsStore();
  const { sendClickShare } = useStatsStore();

  const { fullName, photo, militaryBranch, birthday, deathDate, alive, status, militaryUnit } =
    hero;
  const { drawStoryImage, isSharing } = useLocalStore((rootStore) => new ShareStore(rootStore));
  const { platform, isOk } = useAppParamsStore();

  const onShare = React.useCallback(async () => {
    void sendClickShare();
    await drawStoryImage(hero);
  }, [hero.id]);

  // const onEdit = React.useCallback(() => {
  //   void sendEditHero();

  //   push({ panel: PanelEnum.form, state: { heroId: id, isEdit: true } });
  // }, [id, sendEditHero, push]);

  // todo: убрать после тестирования анкет
  const onApprove = React.useCallback(() => {
    if (userInWhitelist) {
      setStatus(StatusEnum.APPROVED);
    }
  }, [setStatus]);

  // todo: убрать после тестирования анкет
  const onDecline = React.useCallback(() => {
    if (userInWhitelist) {
      setStatus(StatusEnum.REJECTED);
      setProblems([
        DeclineReasonTypeEnum.DUPLICATE_APPLICATION,
        DeclineReasonTypeEnum.INVALID_HERO_PHOTO,
        DeclineReasonTypeEnum.AUTO_MOD_GIGA,
        DeclineReasonTypeEnum.AUTO_MOD_VIZIER,
      ]);
    }
  }, [setStatus, setProblems]);

  const hiddenSharingButton =
    isOk && (platform === 'desktop_web_ok' || platform === 'mobile_web_ok');

  return (
    <div styleName="hero-card">
      <div styleName="header">
        <img styleName="header__photo" src={photo || COMMON_IMAGES.stub} alt={fullName} />
        <div styleName={cx('header__status', `header__status_${status.toLowerCase()}`)}>
          {heroStatuses[status].title}
        </div>
      </div>
      <div styleName="text-wrapper">
        <div styleName="text">
          <h2 styleName="text__name">{fullName}</h2>
          {(birthday || deathDate || alive) && (
            <div styleName="text__dates">
              {birthday || '_'}
              &nbsp;&mdash; {alive ? 'по настоящее время' : deathDate || '_'}
            </div>
          )}
        </div>
        {/* {status !== StatusEnum.UNDER_REVIEW && (
          <button styleName="edit-button" onClick={onEdit}>
            <EditIcon />
          </button>
        )} */}
      </div>
      <div styleName="military-info">
        {militaryBranch && (
          <div styleName="military-info__branch">{militaryBranches[militaryBranch].title}</div>
        )}
        {militaryUnit && <div styleName="military-info__branch">{militaryUnit}</div>}
      </div>
      {/* {status === StatusEnum.REJECTED && (
        <div styleName="problem">
          <WarningIcon styleName="problem__icon" />
          <div styleName="problem__text">
            Внесите исправления в&nbsp;анкету и&nbsp;отправьте заявку повторно
          </div>
        </div>
      )} */}
      {status === StatusEnum.APPROVED && !hiddenSharingButton && (
        <Button
          styleName="share-button"
          stretched
          theme={ButtonTheme.bordered}
          size={ButtonSize.standard}
          onClick={onShare}
          isDisabled={isSharing}
          canClick={!isSharing}
        >
          Поделиться в истории
        </Button>
      )}
      {status === StatusEnum.APPROVED && <GoToWatchPolk />}
      {userInWhitelist && status === StatusEnum.UNDER_REVIEW && (
        <div styleName="dev-buttons">
          <button styleName="dev-button" onClick={onApprove}>
            DEV: Принять анкету
          </button>
          <button styleName="dev-button" onClick={onDecline}>
            DEV: Отклонить анкету
          </button>
        </div>
      )}
    </div>
  );
};

export default observer(HeroCard);
