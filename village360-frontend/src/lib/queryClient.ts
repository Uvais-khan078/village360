import { QueryClient } from "@tanstack/react-query";
// import { getMockData } from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
let isMockMode = false;
let lastCheckTime = 0;
const CHECK_INTERVAL = 30000; // 30 seconds

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function checkBackendAvailability(): Promise<boolean> {
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL && lastCheckTime > 0) {
    return !isMockMode;
  }
  lastCheckTime = now;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      isMockMode = false;
      return true;
    }
  } catch {
    // Backend not reachable
  }
  // isMockMode = true;
  // console.warn('⚠️ Running in mock mode - Backend not available');
  return false;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const isAvailable = await checkBackendAvailability();

  if (isAvailable) {
    try {
      const token = localStorage.getItem("token");
      const fullUrl = `${API_BASE_URL}${url}`;

      const res = await fetch(fullUrl, {
        method,
        headers: {
          ...(data ? { "Content-Type": "application/json" } : {}),
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });

      await throwIfResNotOk(res);
      return res;
    } catch {
      // console.warn('Backend request failed, falling back to mock mode');
      // isMockMode = true;
    }
  }

  // Mock mode
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     let mockResponse: any = {};
  //     try {
  //       mockResponse = getMockData(url, method, data);
  //     } catch (error) {
  //       mockResponse = { message: 'Mock data not implemented for this endpoint' };
  //     }

  //     resolve({
  //       ok: true,
  //       status: 200,
  //       json: () => Promise.resolve(mockResponse),
  //       text: () => Promise.resolve(JSON.stringify(mockResponse)),
  //     } as any);
  //   }, 500); // Simulate network delay
  // });
  throw new Error('Backend request failed and mock mode is disabled.');
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey.join('/');
        const res = await apiRequest('GET', url);
        return res.json();
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});


