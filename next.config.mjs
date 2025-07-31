/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add assetPrefix to handle port changes
  assetPrefix: process.env.NODE_ENV === 'development' ? undefined : '',
  // Add basePath to handle port changes
  basePath: '',
  // Configure port fallback
  serverRuntimeConfig: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  // Add rewrites to handle port changes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig
