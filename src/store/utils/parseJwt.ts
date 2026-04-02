import { captureException } from '@sentry/react';

import { UserServer } from 'entities/user';

export const parseJwt = (token: string): UserServer | null => {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  try {
    const parsed = JSON.parse(atob(parts[1])) as { user: UserServer };

    if (!parsed?.user) {
      return null;
    }

    return parsed.user;
  } catch (e) {
    captureException(e);

    return null;
  }
};
