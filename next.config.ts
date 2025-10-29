/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/blog', destination: '/posts', permanent: true },
      { source: '/blog/:slug', destination: '/posts/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;