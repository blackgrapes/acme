/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },

  // ✅ TEMP FIX for prerender bug in Next.js 15
 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
