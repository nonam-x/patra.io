import { httpLink, httpBatchStreamLink } from "@patra/trpc/client";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: "/api/trpc",
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
