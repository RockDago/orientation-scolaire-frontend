import { QueryClient } from "@tanstack/react-query";

const shouldRetry = (failureCount, error) => {
  const status = error?.response?.status;
  if ([400, 401, 403, 404, 409, 422].includes(status)) return false;
  return failureCount < 1;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: shouldRetry,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
});
