/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["localhost"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Matikan ESLint saat build
  },
};

export default nextConfig;
