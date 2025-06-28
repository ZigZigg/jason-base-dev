'use client';

// Reusable fetch function that uses Next.js Route Handlers
export async function clientFetch<T>(
  url: string,
  options?: RequestInit & { next?: { revalidate?: number } }
): Promise<T> {
  try {
    // Route handlers are relative to the app directory
    // This fixes CORS by using same-origin requests
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}



