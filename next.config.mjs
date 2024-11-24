/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  env: {
    // Add any other environment variables here
  },
  head: {
    title: "Ballroom Music Quiz",
    meta: [
      { name: "description", content: "Test your ballroom music knowledge!" },
    ],
  },
};

export default nextConfig;