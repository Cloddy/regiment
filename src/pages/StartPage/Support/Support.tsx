import * as React from 'react';

import './Support.module.scss';

const Support: React.FC<PropsWithClassName> = ({ className }) => {
  return (
    <div styleName="wrapper" className={className}>
      <div styleName="text">При поддержке</div>
      <div styleName="logo-sber" />
      <div styleName="logo-vk" />
    </div>
  );
};

export default React.memo(Support);
