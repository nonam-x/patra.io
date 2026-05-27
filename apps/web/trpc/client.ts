import { createTRPCReact } from "@trpc/react-query";
import type { ServerRouter } from "@patra/trpc/client";

export const trpc = createTRPCReact<ServerRouter>();
