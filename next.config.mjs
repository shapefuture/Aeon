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

export default nextConfig;