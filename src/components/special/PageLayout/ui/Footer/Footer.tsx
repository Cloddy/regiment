import * as React from 'react';

import { POLICY_URL } from 'config/links';

import './Footer.modules.scss';

const Footer = () => (
  <div styleName="footer">
    <div styleName="logo">
      <div styleName="sber" />
      <div styleName="sber-mobile" />
      <div styleName="vk" />
    </div>
    <div styleName="phone">
      Горячая линия Бессмертного полка
      <br />
      <a href="tel:88002019450" target="_blank" rel="norefferer noreferrer" styleName="phone-link">
        8&nbsp;800&nbsp;20-1945-0
      </a>
    </div>
    <a href={POLICY_URL} target="_blank" rel="norefferer noreferrer" styleName="policy">
      Политика конфиденциальности
    </a>
  </div>
);

export default React.memo(Footer);
