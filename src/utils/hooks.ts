import * as React from 'react';

export const useEventListener = (
  target: React.MutableRefObject<any> | HTMLElement | Window | Document = window,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options: EventListenerOptions | boolean
): void => {
  React.useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    const targetIsRef = target.hasOwnProperty('current');
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const currentTarget: HTMLElement = targetIsRef ? target?.current : target;

    if (currentTarget) {
      currentTarget.addEventListener(type, listener, options);
    }

    return (): void => {
      if (currentTarget) {
        currentTarget.removeEventListener(type, listener, options);
      }
    };
  }, [target, type, listener, options]);
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
