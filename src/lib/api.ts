
class ApiClient {
  private baseUrl: string;
  private accessToken?: string;

  constructor(accessToken?: string) {
    // Read baseUrl from environment variables
    this.baseUrl = process.env.API_ENDPOINT!;
    if (!this.baseUrl) {
      throw new Error("API_ENDPOINT environment variable is not set");
    }
    this.accessToken = accessToken;
  }

  private async request<T>(
    method: string,
    url: string,
    body?: any,
    options?: RequestInit & { next?: { revalidate?: number } }  // Add Next.js cache options
  ): Promise<T> {
    const headers = new Headers(options?.headers);

    // Add Bearer token if accessToken exists
    if (this.accessToken) {

      // headers.append("Authorization", `Bearer ${this.accessToken}`);
      headers.append("x-api-key", `${process.env.JASON_PARTNER_API_KEY}`);
    }

    // Add default headers
    headers.append("Content-Type", "application/json");

    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
      next: options?.next
    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }

    return response.json();
  }
  async get<T>(url: string, options?: RequestInit & { next?: { revalidate?: number } }): Promise<T> {
    return this.request<T>("GET", url, undefined, options);
  }

  async post<T>(url: string, body: any, options?: RequestInit & { next?: { revalidate?: number } }): Promise<T> {
    return this.request<T>("POST", url, body, options);
  }
  async put<T>(url: string, body: any, options?: RequestInit & { next?: { revalidate?: number } }): Promise<T> {
    return this.request<T>("PUT", url, body, options);
  }

  async delete<T>(url: string, options?: RequestInit & { next?: { revalidate?: number } }): Promise<T> {
    return this.request<T>("DELETE", url, undefined, options);
  }
}

export default ApiClient;