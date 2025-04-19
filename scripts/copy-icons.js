#!/usr/bin/env node

/**
 * Script to copy icons to the correct location for GitHub Pages
 */

const fs = require('fs');
const path = require('path');

// Define paths
const publicDir = path.join(__dirname, '../public');
const outDir = path.join(__dirname, '../out');

// Create icons directory in out directory if it doesn't exist
const outIconsDir = path.join(outDir, 'icons');
if (!fs.existsSync(outIconsDir)) {
  fs.mkdirSync(outIconsDir, { recursive: true });
}

// Copy icons from public/icons to out/icons
const publicIconsDir = path.join(publicDir, 'icons');
if (fs.existsSync(publicIconsDir)) {
  const icons = fs.readdirSync(publicIconsDir);
  icons.forEach(icon => {
    const srcPath = path.join(publicIconsDir, icon);
    const destPath = path.join(outIconsDir, icon);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcPath} to ${destPath}`);
  });
}

// Also copy to the Aeon subdirectory
const aeonDir = path.join(outDir, 'Aeon');
if (fs.existsSync(aeonDir)) {
  const aeonIconsDir = path.join(aeonDir, 'icons');
  if (!fs.existsSync(aeonIconsDir)) {
    fs.mkdirSync(aeonIconsDir, { recursive: true });
  }
  
  const icons = fs.readdirSync(publicIconsDir);
  icons.forEach(icon => {
    const srcPath = path.join(publicIconsDir, icon);
    const destPath = path.join(aeonIconsDir, icon);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcPath} to ${destPath}`);
  });
}

console.log('Icons copied successfully!');
