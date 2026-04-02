import * as React from 'react';

import { DeclineHeroReasonType } from 'entities/declineReason';

import './DeclineReasons.module.scss';

type Props = {
  reasons?: DeclineHeroReasonType[];
};

const DeclineReasons: React.FC<Props> = ({ reasons }) => {
  if (!reasons || reasons.length === 0) {
    return null;
  }

  return (
    <div styleName="reasons">
      <div styleName="reasons-wrapper">
        <h2 styleName="title">Причины отклонения заявки:</h2>
        <ul styleName="reasons-list">
          {reasons.map((reason) => (
            <li key={reason.id} styleName="text">
              {reason.description}
            </li>
          ))}
        </ul>
        <div styleName="try-again text">
          Внесите исправления в&nbsp;анкету и&nbsp;отправьте заявку повторно
        </div>
      </div>
    </div>
  );
};

export default React.memo(DeclineReasons);
