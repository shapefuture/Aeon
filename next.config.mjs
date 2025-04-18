import withPWA from 'next-pwa';
import path from 'path';

const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/Aeon' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Aeon/' : '',
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(import.meta.dirname, '');
    return config;
  },
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  }
});