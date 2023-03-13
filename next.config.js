/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/socket',
        destination: 'https://app-ruscello.vercel.app/api/socket',
      },
    ]
  }
}

module.exports = nextConfig
