import * as React from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { useHistoryStore } from 'store/hooks';

export const useSetHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const action = useNavigationType();

  const { setNavigateFunction, setLocation } = useHistoryStore();

  React.useEffect(() => {
    setNavigateFunction(navigate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  React.useEffect(() => {
    setLocation(location, action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, location]);
};
