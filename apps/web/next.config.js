/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/trpc";

    if (process.env.VERCEL === "1" && !process.env.NEXT_PUBLIC_API_URL) {
      console.error(
        "\x1b[31m[Error] NEXT_PUBLIC_API_URL is not set on Vercel! " +
        "This will fall back to localhost, causing Vercel proxy requests to fail with DNS_HOSTNAME_RESOLVED_PRIVATE. " +
        "Please add NEXT_PUBLIC_API_URL (e.g., https://patra-io.onrender.com/trpc) in Vercel Project Settings.\x1b[0m"
      );
    }

    const cleanedApiHost = apiHost.replace(/\/trpc$/, "");
    return [
      {
        source: "/api/trpc/:path*",
        destination: `${cleanedApiHost}/trpc/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${cleanedApiHost}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
