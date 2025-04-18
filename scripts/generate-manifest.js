const fs = require('fs');
const path = require('path');

const basePath = process.env.NODE_ENV === 'production' ? '/aeon' : '';

const manifest = {
  short_name: "aeon",
  name: "aeon",
  icons: [
    {
      src: `${basePath}/icons/icon-192x192.png`,
      type: "image/png",
      sizes: "192x192"
    },
    {
      src: `${basePath}/icons/icon-512x512.png`,
      type: "image/png",
      sizes: "512x512"
    }
  ],
  start_url: `${basePath}/`,
  background_color: "#ffffff",
  display: "standalone",
  theme_color: "#000000",
  scope: `${basePath}/`
};

fs.writeFileSync(
  path.join(__dirname, '../public/manifest.json'),
  JSON.stringify(manifest, null, 2)
);