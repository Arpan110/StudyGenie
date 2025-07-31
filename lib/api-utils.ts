/**
 * Utility functions for API calls
 */

/**
 * Get the base URL for API calls, handling different environments and ports
 */
export function getApiBaseUrl(): string {
  // In the browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // In server-side rendering
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

/**
 * Create a full API URL from a path
 */
export function createApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}