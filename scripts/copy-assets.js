#!/usr/bin/env node

/**
 * Script to copy assets to the correct location for GitHub Pages
 */

const fs = require('fs');
const path = require('path');

// Define paths
const publicDir = path.join(__dirname, '../public');
const outDir = path.join(__dirname, '../out');
const aeonDir = path.join(outDir, 'Aeon');

// Create Aeon directory if it doesn't exist
if (!fs.existsSync(aeonDir)) {
  fs.mkdirSync(aeonDir, { recursive: true });
}

// Create icons directory in Aeon directory
const iconsDir = path.join(aeonDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Copy icons from public/icons to out/Aeon/icons
const publicIconsDir = path.join(publicDir, 'icons');
if (fs.existsSync(publicIconsDir)) {
  const icons = fs.readdirSync(publicIconsDir);
  icons.forEach(icon => {
    const srcPath = path.join(publicIconsDir, icon);
    const destPath = path.join(iconsDir, icon);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcPath} to ${destPath}`);
  });
}

// Copy manifest.json to out/Aeon
const manifestSrc = path.join(publicDir, 'manifest.json');
const manifestDest = path.join(aeonDir, 'manifest.json');
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log(`Copied ${manifestSrc} to ${manifestDest}`);
}

// Copy favicon.ico to out/Aeon
const faviconSrc = path.join(publicDir, 'favicon.ico');
const faviconDest = path.join(aeonDir, 'favicon.ico');
if (fs.existsSync(faviconSrc)) {
  fs.copyFileSync(faviconSrc, faviconDest);
  console.log(`Copied ${faviconSrc} to ${faviconDest}`);
}

// Copy gh-pages-redirect.js to out/Aeon
const redirectSrc = path.join(publicDir, 'gh-pages-redirect.js');
const redirectDest = path.join(aeonDir, 'gh-pages-redirect.js');
if (fs.existsSync(redirectSrc)) {
  fs.copyFileSync(redirectSrc, redirectDest);
  console.log(`Copied ${redirectSrc} to ${redirectDest}`);
}

console.log('Assets copied successfully!');
