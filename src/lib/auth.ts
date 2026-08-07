import { isAuthDevMode } from './authDevMode';

// Dev mode auth helper for local development only
export function getAuthHeaders(): Record<string, string> {
  const devUserId = localStorage.getItem('devUserId');

  if (devUserId && isAuthDevMode()) {
    return {
      'x-dev-user-id': devUserId,
    };
  }

  return {};
}

export function setDevUserId(userId: string) {
  localStorage.setItem('devUserId', userId);
}

export function getDevUserId() {
  return localStorage.getItem('devUserId');
}
