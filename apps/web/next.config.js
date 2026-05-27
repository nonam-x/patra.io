/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiHost = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/trpc").replace(/\/trpc$/, "");
    return [
      {
        source: "/api/trpc/:path*",
        destination: `${apiHost}/trpc/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${apiHost}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
