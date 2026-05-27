import { httpLink, httpBatchStreamLink } from "@patra/trpc/client";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  // Direct client request configuration:
  // In production, we call NEXT_PUBLIC_API_URL directly from the client to avoid Vercel rewrite proxy overhead and 404s.
  // In development, we use relative /api/trpc so Next.js handles proxying, allowing mobile emulators/devices to connect.
  const defaultProdApiUrl = "https://patra-io.onrender.com/trpc";
  const apiHost = typeof window !== "undefined"
    ? (isProd ? (process.env.NEXT_PUBLIC_API_URL || defaultProdApiUrl) : "/api/trpc")
    : (process.env.NEXT_PUBLIC_API_URL || (isProd ? defaultProdApiUrl : "http://localhost:8000/trpc"));

  return c({
    url: apiHost,
    fetch(url, options) {
      // TODO (BUG-11): Once secure httpOnly cookies are implemented, token extraction from localStorage
      // will be obsolete, as the browser will attach the credentials cookie automatically.
      const token = typeof window !== "undefined" ? localStorage.getItem("patra_token") : null;
      const headers = new Headers(options?.headers);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    },
  });
};
