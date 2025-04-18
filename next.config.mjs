/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
import path from 'path';

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
  output: 'export',
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(import.meta.dirname, '');
    return config;
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
