import { observer } from 'mobx-react';
import * as React from 'react';

import { Button, ButtonSize, ButtonTheme } from 'components/common';
import { Selector, useSelector } from 'components/inputs';
import Modal from 'components/modals/Modal';
import { federalDistrictsArray, FederalDistrictType } from 'config/federalDistricts';
import { ModalEnum } from 'config/routes/enums';
import { useHistoryStore, useStatsStore, useUserStore } from 'store/hooks';

import './RegionModal.modules.scss';

type Props = {
  onSelect: VoidFunction;
};

const RegionModal: React.FC<Props> = ({ onSelect }: Props) => {
  const { modal, goBack } = useHistoryStore();
  const isOpen = React.useMemo(() => modal === ModalEnum.region, [modal]);

  const [visible, setVisible, region, setRegion] = useSelector<FederalDistrictType>(null);

  const canContinue = React.useMemo(() => region?.id, [region]);

  const { setFederalDistrict } = useUserStore();
  const { sendCancelRegion } = useStatsStore();

  const onGoNext = React.useCallback(() => {
    if (!region) {
      return;
    }

    if (canContinue) {
      void setFederalDistrict(region.id).then((res) => {
        if (res) {
          onSelect();
        }
      });
    }
  }, [region, canContinue, onSelect, setFederalDistrict]);

  const onClose = React.useCallback(() => {
    void sendCancelRegion();

    goBack();
  }, [goBack, sendCancelRegion]);

  return (
    <Modal id={ModalEnum.region} fullWidth withCross onClose={onClose}>
      {isOpen && (
        <>
          <div styleName="ribbon" />
          <div styleName="title">
            Выберите
            <br />
            федеральный округ
          </div>
          <div styleName="text">
            Ваши герои могут стать частью шествия не&nbsp;только на&nbsp;сайте,
            но&nbsp;и&nbsp;в&nbsp;эфире российских федеральных телеканалов.
            <br />
            Выберите, в&nbsp;трансляции какого округа вы&nbsp;хотите принять участие
          </div>
          <Selector
            contentVisible={visible}
            setContentVisible={setVisible}
            currentValue={region}
            setValue={setRegion}
            values={federalDistrictsArray}
            placeholder="Выбрать федеральный округ"
            valueIDProperty="id"
            valueNameProperty="title"
            withBottomMargin
            styleName="content_visible"
          />
          <div styleName="buttons">
            <Button
              styleName="button"
              onClick={onGoNext}
              isDisabled={!canContinue}
              size={ButtonSize.standard}
              stretched
            >
              Продолжить
            </Button>
            <Button
              styleName="button"
              onClick={onClose}
              theme={ButtonTheme.bordered}
              size={ButtonSize.standard}
              stretched
            >
              Отменить
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default observer(RegionModal);
