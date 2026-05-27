export async function createContext(opts?: {
  req?: any;
  res?: any;
}) {
  const req = opts?.req;
  const ipAddress = req ? (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown") : "unknown";
  const authHeader = req?.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

  return {
    Developer: "nonamx",
    ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
    token,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
