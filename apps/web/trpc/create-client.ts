import { httpLink, httpBatchStreamLink } from "@patra/trpc/client";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (
  opts?: CreateTRPCHttpBatchClientClientOpts
) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;

  const apiHost =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://patra-io.onrender.com/trpc";

  return c({
    url: apiHost,

    fetch(url, options) {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("patra_token")
          : null;

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