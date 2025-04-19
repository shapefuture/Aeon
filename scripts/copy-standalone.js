#!/usr/bin/env node

/**
 * Script to copy the standalone HTML file to the out directory
 */

const fs = require('fs');
const path = require('path');

// Define paths
const standaloneHtmlPath = path.join(__dirname, '../public/standalone.html');
const outIndexPath = path.join(__dirname, '../out/index.html');
const out404Path = path.join(__dirname, '../out/404.html');

// Copy the standalone HTML file to the out directory
console.log('Copying standalone HTML to out directory...');
fs.copyFileSync(standaloneHtmlPath, outIndexPath);
console.log('Standalone HTML copied to index.html successfully!');

// Also copy it to 404.html
console.log('Copying standalone HTML to 404.html...');
fs.copyFileSync(standaloneHtmlPath, out404Path);
console.log('Standalone HTML copied to 404.html successfully!');
