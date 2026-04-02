import * as React from 'react';

import ErrorBoundary from './ErrorBoundary';

export const withErrorBoundary = (PageComponent: React.FC<React.ComponentProps<any>>) => {
  return (props: React.ComponentProps<any>) => (
    <ErrorBoundary>
      <PageComponent {...props} />
    </ErrorBoundary>
  );
};

export default withErrorBoundary;
