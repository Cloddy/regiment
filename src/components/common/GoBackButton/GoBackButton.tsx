import * as React from 'react';

import ArrowLeft from 'assets/img/common/arrow-left.svg?react';
import { useHistoryStore } from 'store/hooks';

import './GoBackButton.module.scss';

const GoBackButton: React.FC = () => {
  const { goBack } = useHistoryStore();

  return (
    <button styleName="go-back-button" onClick={goBack}>
      <ArrowLeft />
    </button>
  );
};

export default GoBackButton;
