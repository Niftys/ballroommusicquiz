/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

module.exports = {
    reactStrictMode: true,
    experimental: {
      appDir: true,
    },
    head: {
      title: "Ballroom Music Quiz",
      meta: [
        { name: "description", content: "Do you know your partner dance genres?" },
      ],
    },
  };
  