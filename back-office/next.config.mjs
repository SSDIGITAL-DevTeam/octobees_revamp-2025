/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Matikan ESLint saat build
  },
};

export default nextConfig;
