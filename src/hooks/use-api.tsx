"use client";

import { useCallback, useReducer } from "react";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

interface ApiOptions<T> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: T;
  headers?: HeadersInit;
  queryParams?: Record<string, string | number | boolean | undefined>;
}

type Action<T> =
  | { type: "API_START" }
  | { type: "API_SUCCESS"; payload: T; message: string }
  | { type: "API_ERROR"; error: string };

function apiReducer<T>(state: ApiState<T>, action: Action<T>): ApiState<T> {
  switch (action.type) {
    case "API_START":
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };
    case "API_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload,
        message: action.message,
      };
    case "API_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export function useApi<T>(
  url: string
): [ApiState<T>, (options?: ApiOptions<T>) => Promise<void>] {
  const initialState: ApiState<T> = {
    data: null,
    loading: false,
    error: null,
    message: null,
  };

  const [state, dispatch] = useReducer(apiReducer, initialState);

  const callApi = useCallback(
    async (options: ApiOptions<T> = { method: "GET" }) => {
      dispatch({ type: "API_START" });

      const queryString = options.queryParams
        ? "?" +
          new URLSearchParams(
            Object.entries(options.queryParams)
              .filter(([, value]) => value != null)
              .map(([key, value]) => [key, String(value)])
          ).toString()
        : "";

      try {
        const response = await fetch(`${url}${queryString}`, {
          method: options.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          body: options.body ? JSON.stringify(options.body) : null,
        });

        const result: ApiResponse<T> = await response.json();

        if (!response.ok || !result.success) {
          dispatch({
            type: "API_ERROR",
            error: result.error || result.message || "An error occurred",
          });
        } else {
          dispatch({
            type: "API_SUCCESS",
            payload: result.data as T,
            message: result.message,
          });
        }
      } catch (error) {
        dispatch({
          type: "API_ERROR",
          error: (error as Error).message || "An unexpected error occurred",
        });
      }
    },
    [url]
  );

  return [state, callApi];
}
