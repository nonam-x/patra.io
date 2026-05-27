/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
    const defaultProdApiUrl = "https://patra-io.onrender.com/trpc";
    const apiHost = process.env.NEXT_PUBLIC_API_URL || (isProd ? defaultProdApiUrl : "http://localhost:8000/trpc");

    if (process.env.VERCEL === "1" && !process.env.NEXT_PUBLIC_API_URL) {
      console.warn(
        "\x1b[33m[Warning] NEXT_PUBLIC_API_URL is not set on Vercel! " +
        "Falling back to default production Render URL: " + defaultProdApiUrl + "\x1b[0m"
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
