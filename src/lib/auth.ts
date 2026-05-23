// Dev mode auth helper for local development
export function getAuthHeaders(): Record<string, string> {
  // Check if we're in dev mode and have a dev user ID
  const devUserId = localStorage.getItem('devUserId');
  
  if (devUserId && process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true') {
    return {
      'x-dev-user-id': devUserId,
    };
  }
  
  // Otherwise, return empty - let Supabase auth handle it
  return {};
}

export function setDevUserId(userId: string) {
  localStorage.setItem('devUserId', userId);
}

export function getDevUserId() {
  return localStorage.getItem('devUserId');
}
