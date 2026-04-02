import { observer } from 'mobx-react';
import * as React from 'react';
import { scroller, animateScroll } from 'react-scroll';

import { Button, ButtonTheme, Loader } from 'components/common';
import {
  DeleteModal,
  FormDeletedModal,
  FormSentModal,
  CancelFormModal,
  CropModal,
} from 'components/modals/views';
import { PageLayout } from 'components/special';
import { ModalEnum, PanelEnum } from 'config/routes/enums';
import { StatusEnum } from 'config/statuses';
import { DEFAULT_SCROLLER_OPTIONS } from 'config/ui';
import { StatFormContextEnum } from 'store/globals/stats';
import { useHeroesStore, useHistoryStore, useLocalStore, useStatsStore } from 'store/hooks';
import { CropStore, CropStoreProvider } from 'store/locals/CropStore';
import FormPageStore, { FormPageStoreProvider } from 'store/locals/FormPageStore';
import { getTopSafeArea } from 'utils/vkuiUtils';

import { Form, DeclineReasons } from './components';

import './FormPage.module.scss';

const FormPage: React.FC = () => {
  const { state, replace, push, goBack } = useHistoryStore();
  const { hasAtLeastOneHero } = useHeroesStore();
  const { sendClickSendHero, sendSendHeroToSber, sendClickCancelHero } = useStatsStore();
  const formPageStore = useLocalStore((rootStore) => new FormPageStore(rootStore));
  const cropStore = useLocalStore(() => new CropStore());

  const {
    init,
    currentForm,
    formList: {
      create,
      edit,
      errorMessage,
      isSending,
      isDeleting,
      isHeroLoading,
      resetBuffForm,
      deleteHero,
    },
  } = formPageStore;

  const { isEdit, heroId } = state[PanelEnum.form];

  React.useEffect(() => {
    if (currentForm?.id) {
      animateScroll.scrollToTop(DEFAULT_SCROLLER_OPTIONS);
    }
  }, [currentForm?.id]);

  React.useEffect(() => {
    void init(heroId, isEdit);
  }, [formPageStore, heroId, isEdit]);

  const onDelete = React.useCallback(async () => {
    if (heroId) {
      const deleted = await deleteHero(heroId);

      if (deleted) {
        replace({ modal: ModalEnum.formDeleted });
      } else {
        goBack();
      }
    }
  }, [heroId, deleteHero]);

  const showDeleteModal = React.useCallback(() => {
    push({
      panel: PanelEnum.form,
      modal: ModalEnum.deleteForm,
      state: { heroId, isEdit },
    });
  }, [heroId, isEdit]);

  // доскролл к неверным полям
  const onScrollToErrorField = (field: string) => {
    if (field) {
      scroller.scrollTo(field, {
        ...DEFAULT_SCROLLER_OPTIONS,
        ignoreCancelEvents: true,
        offset: -10 - getTopSafeArea(),
      });
    }
  };

  const onSendForm = React.useCallback(async () => {
    void sendClickSendHero();

    const result =
      isEdit && heroId
        ? await edit(heroId, onScrollToErrorField)
        : await create(onScrollToErrorField);

    if (result) {
      void sendSendHeroToSber(isEdit ? StatFormContextEnum.edit : StatFormContextEnum.new);

      replace({ modal: ModalEnum.formSent });
    }
  }, [isEdit, heroId, currentForm?.id, sendClickSendHero, sendSendHeroToSber]);

  const showCancelFormModal = React.useCallback(() => {
    if (!currentForm) {
      return;
    }

    void sendClickCancelHero(isEdit ? StatFormContextEnum.edit : StatFormContextEnum.new);

    if (isEdit ? currentForm.formChanged : !currentForm.empty) {
      push({ modal: ModalEnum.cancelForm });
    } else {
      resetBuffForm();
      replace({ panel: hasAtLeastOneHero ? PanelEnum.heroes : PanelEnum.start });
    }
  }, [
    currentForm?.empty,
    currentForm?.formChanged,
    hasAtLeastOneHero,
    isEdit,
    sendClickCancelHero,
  ]);

  return (
    <FormPageStoreProvider store={formPageStore}>
      <CropStoreProvider store={cropStore}>
        <PageLayout styleName="form-page" withFooter={false}>
          <h1 styleName="title">{isEdit ? 'Редактировать героя' : 'Добавить героя'}</h1>
          {isEdit && currentForm?.status === StatusEnum.REJECTED && (
            <DeclineReasons reasons={currentForm?.problems} />
          )}
          <Form
            data={currentForm}
            isEdit={Boolean(isEdit)}
            errorMessage={isEdit ? errorMessage : undefined}
            footer={
              <div styleName="buttons">
                <Button
                  theme={ButtonTheme.filled}
                  stretched
                  onClick={onSendForm}
                  isDisabled={
                    isEdit ? !currentForm?.showSaveEditsButton : !currentForm?.showAddButton
                  }
                >
                  Сохранить
                </Button>
                {isEdit && (
                  <Button theme={ButtonTheme.bordered} stretched onClick={showDeleteModal}>
                    Удалить заявку
                  </Button>
                )}
                <Button theme={ButtonTheme.bordered} stretched onClick={showCancelFormModal}>
                  Отменить
                </Button>
              </div>
            }
          />
          <CancelFormModal />
          <DeleteModal onDelete={onDelete} withoutGoBack />
          <FormDeletedModal hasAtLeastOneHero={hasAtLeastOneHero} />
          <FormSentModal canAddNewHero={formPageStore.formList.canAddForm} />
          <CropModal />
          {(isSending || isHeroLoading || isDeleting) && (
            <Loader
              text={isSending ? 'Отправляем анкету' : ''}
              withBackground
              withoutProgress
              showInPortal
            />
          )}
        </PageLayout>
      </CropStoreProvider>
    </FormPageStoreProvider>
  );
};

export default observer(FormPage);
