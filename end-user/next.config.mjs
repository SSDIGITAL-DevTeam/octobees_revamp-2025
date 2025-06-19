/** @type {import('next').NextConfig} */
const nextConfig = {
  // env: {
  //   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  //   NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  //   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  //   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  //   NEXT_PUBLIC_API_URL_IMAGE: process.env.NEXT_PUBLIC_API_URL_IMAGE,
  // },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lightyellow-mandrill-246257.hostingersite.com",
        port: "",
        pathname: "/api/v1/end-user/**",
      },
      {
        protocol: "http",
        hostname: "192.168.100.25",
        port: "3005",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.octobees.com",
        pathname: "/**",
      },
    ],
    domains: [
      "lightyellow-mandrill-246257.hostingersite.com",
      "localhost",
      "192.168.100.25",
    ],
  },
};

export default nextConfig;
