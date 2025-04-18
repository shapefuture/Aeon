const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});
const path = require('path');

const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/aeon' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aeon/' : '',
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, '');
    return config;
  },
  trailingSlash: true,
  experimental: {
    optimizeCss: true,
  },
};

module.exports = withPWA(nextConfig);
