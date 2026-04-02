import * as React from 'react';

import { Button, ButtonSize } from 'components/common';
import { useRootStore } from 'store/globals/root';
import { useAppParamsStore } from 'store/hooks';

import './ErrorFallback.module.scss';

const ErrorFallback: React.FC = () => {
  const { reload } = useRootStore();

  const { search } = useAppParamsStore();

  return (
    <div styleName="error">
      <div styleName="title">
        Произошла ошибка!
        <br />
        Перезагрузите приложение или попробуйте позже
      </div>
      {search && (
        <Button size={ButtonSize.standard} styleName="button" onClick={reload} stretched>
          Перезагрузить
        </Button>
      )}
    </div>
  );
};

export default React.memo(ErrorFallback);
