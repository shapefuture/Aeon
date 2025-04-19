const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})
const path = require('path')

// Add bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/Aeon' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Aeon/' : '',
  webpack: config => {
    config.resolve.alias['@'] = path.join(__dirname, '')
    return config
  },
  trailingSlash: true,
  experimental: {
    optimizeCss: true,
  },
}

// Apply bundle analyzer and PWA
module.exports = withBundleAnalyzer(withPWA(nextConfig))
