const fs = require('fs')
const path = require('path')

const basePath = process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS ? '/Aeon' : ''

const manifest = {
  short_name: 'Aeon',
  name: 'Aeon Website',
  icons: [
    {
      src: `${basePath}/icons/icon-192x192.png`,
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: `${basePath}/icons/icon-512x512.png`,
      type: 'image/png',
      sizes: '512x512',
    },
  ],
  start_url: `${basePath}/`,
  background_color: '#000000',
  display: 'standalone',
  theme_color: '#000000',
  scope: `${basePath}/`,
}

fs.writeFileSync(path.join(__dirname, '../public/manifest.json'), JSON.stringify(manifest, null, 2))
