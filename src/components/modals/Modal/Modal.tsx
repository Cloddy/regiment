import cn from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';

import CloseButton from 'assets/img/common/cross.c.svg?react';
import { Button, ButtonProps, ButtonSize, GoBackButton } from 'components/common';
import { ModalEnum } from 'config/routes/enums';
import { useHistoryStore } from 'store/hooks';
import usePreventScroll from 'utils/usePreventScroll';

import './Modal.module.scss';

const backgroundTransitions: { [key: string]: React.CSSProperties } = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const bodyTransitions: { [key: string]: React.CSSProperties } = {
  entering: { transform: 'translate3d(-50%, 50%, 0)', opacity: 0 },
  entered: { transform: 'translate3d(-50%, -50%, 0)', opacity: 1 },
  exiting: { transform: 'translate3d(-50%, 50%, 0)', opacity: 0 },
  exited: { transform: 'translate3d(-50%, 50%, 0)', opacity: 0 },
};

type Props = DefaultProps & {
  id?: ModalEnum;
  hasBlur?: boolean;
  fullWidth?: boolean;
  withCross?: boolean;
  withLogo?: boolean;
  withGoBack?: boolean;
  buttons?: ButtonProps[];
  onClose?: VoidFunction;
};

const Modal: React.FC<Props> = ({
  className,
  children,
  id,
  hasBlur = false,
  fullWidth = false,
  withCross = false,
  withLogo = false,
  withGoBack = false,
  buttons,
  onClose,
}: Props) => {
  const { goBack, modal } = useHistoryStore();

  const shown = React.useMemo(() => modal === id, [id, modal]);

  usePreventScroll(shown);

  const handleClose = React.useCallback(() => {
    if (onClose) {
      onClose();

      return;
    }

    goBack();
  }, [goBack, onClose]);

  return (
    <Transition in={shown} timeout={300} mountOnEnter unmountOnExit>
      {(state: TransitionStatus) => (
        <div styleName="modal">
          <div
            style={{ ...backgroundTransitions[state] }}
            styleName={cn('modal__background', hasBlur && 'modal__background_with-blur')}
            onClick={withGoBack ? goBack : undefined}
          />
          <div
            style={{ ...bodyTransitions[state] }}
            styleName={cn(
              'modal__body',
              !hasBlur && 'modal__body_with-background',
              fullWidth && 'modal__body_full-width'
            )}
            className={className}
          >
            {withCross && <CloseButton styleName="close-button" onClick={handleClose} />}
            {withGoBack && <GoBackButton />}
            <div styleName="content">
              {withLogo && <div styleName="logo" />}
              {children}
            </div>
            {buttons && (
              <div styleName="buttons">
                {buttons.map((button, i) => (
                  <Button
                    key={i}
                    size={fullWidth ? ButtonSize.standard : ButtonSize.small}
                    stretched
                    {...button}
                  >
                    {button.children}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Transition>
  );
};

export default observer(Modal);
