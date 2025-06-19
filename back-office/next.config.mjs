/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'api.octobees.com',
      pathname: '/**',
    },
  ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Matikan ESLint saat build
  },
};

export default nextConfig;
