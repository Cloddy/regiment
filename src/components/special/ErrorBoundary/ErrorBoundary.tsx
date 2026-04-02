import * as React from 'react';

import { ErrorFallback } from '../ErrorFallback';

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<React.ComponentProps<any>, State> {
  state: State = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;
