import { useCallback } from 'react';

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export function useCookies() {
  // Get cookie value
  const getCookie = useCallback((name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }, []);

  // Set cookie with options
  const setCookie = useCallback((
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    cookieString += ";path=/";
    
    if (options.expires) cookieString += `;expires=${options.expires.toUTCString()}`;
    if (options.maxAge) cookieString += `;max-age=${options.maxAge}`;
    if (options.domain) cookieString += `;domain=${options.domain}`;
    // if (options.secure) cookieString += `;secure`;
    if (options.sameSite) cookieString += `;samesite=${options.sameSite}`;

    document.cookie = cookieString;
  }, []);

  return {
    getCookie,
    setCookie
  };
}