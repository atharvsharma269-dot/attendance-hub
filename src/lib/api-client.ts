const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const API_VERSION = "v1";

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

interface RequestConfig extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_TIMEOUT = 30000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryableError = (status: number): boolean => {
  // Retry on 5xx server errors and 429 rate limit
  return status >= 500 || status === 429;
};

export const buildUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/api/${API_VERSION}/${cleanEndpoint}`;
};

export const apiClient = async <T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const {
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    timeout = DEFAULT_TIMEOUT,
    headers,
    ...restConfig
  } = config;

  const url = buildUrl(endpoint);
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const error: ApiError = {
          message: responseData?.message || `HTTP ${response.status} Error`,
          code: responseData?.code || `HTTP_${response.status}`,
          details: responseData?.details,
        };

        // Check if we should retry
        if (attempt < retries && isRetryableError(response.status)) {
          lastError = error;
          console.warn(`API retry attempt ${attempt + 1}/${retries} for ${endpoint}`);
          await sleep(retryDelay * (attempt + 1)); // Exponential backoff
          continue;
        }

        return { data: null, error, status: response.status };
      }

      return { data: responseData as T, error: null, status: response.status };
    } catch (err) {
      clearTimeout(timeoutId);

      const isTimeout = err instanceof Error && err.name === "AbortError";
      const error: ApiError = {
        message: isTimeout ? "Request timeout" : "Network error",
        code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
        details: err instanceof Error ? err.message : undefined,
      };

      if (attempt < retries) {
        lastError = error;
        console.warn(`API retry attempt ${attempt + 1}/${retries} for ${endpoint}`);
        await sleep(retryDelay * (attempt + 1));
        continue;
      }

      return { data: null, error, status: 0 };
    }
  }

  return { data: null, error: lastError, status: 0 };
};

// Convenience methods
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: "POST", body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: "DELETE" }),
};
