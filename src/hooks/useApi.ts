import { useState, useCallback } from "react";
import { api, ApiResponse, ApiError } from "@/lib/api-client";

interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  status: number | null;
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(options: UseApiOptions = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    status: null,
  });

  const execute = useCallback(
    async (
      method: "get" | "post" | "put" | "patch" | "delete",
      endpoint: string,
      body?: unknown
    ): Promise<ApiResponse<T>> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      let response: ApiResponse<T>;

      if (method === "get" || method === "delete") {
        response = await api[method]<T>(endpoint);
      } else {
        response = await api[method]<T>(endpoint, body);
      }

      setState({
        data: response.data,
        error: response.error,
        isLoading: false,
        status: response.status,
      });

      if (response.error) {
        options.onError?.(response.error);
      } else if (response.data) {
        options.onSuccess?.(response.data);
      }

      return response;
    },
    [options]
  );

  const get = useCallback(
    (endpoint: string) => execute("get", endpoint),
    [execute]
  );

  const post = useCallback(
    (endpoint: string, body: unknown) => execute("post", endpoint, body),
    [execute]
  );

  const put = useCallback(
    (endpoint: string, body: unknown) => execute("put", endpoint, body),
    [execute]
  );

  const patch = useCallback(
    (endpoint: string, body: unknown) => execute("patch", endpoint, body),
    [execute]
  );

  const del = useCallback(
    (endpoint: string) => execute("delete", endpoint),
    [execute]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      status: null,
    });
  }, []);

  return {
    ...state,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  };
}
