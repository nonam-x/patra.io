import { httpLink, httpBatchStreamLink } from "@patra/trpc/client";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;

  // Direct client request configuration:
  // If NEXT_PUBLIC_API_URL is configured (e.g. https://patra-io.onrender.com/trpc), we call the API directly.
  // This bypasses Next.js rewrite proxying on Vercel, solving DNS_HOSTNAME_RESOLVED_PRIVATE 404s.
  // CORS is already configured on Express to support this.
  const apiHost = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "/api/trpc")
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/trpc");

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
