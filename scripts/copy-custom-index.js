#!/usr/bin/env node

/**
 * Script to copy the custom index.html to the out directory
 */

const fs = require('fs');
const path = require('path');

// Define paths
const customIndexPath = path.join(__dirname, '../public/custom-index.html');
const outIndexPath = path.join(__dirname, '../out/index.html');
const out404Path = path.join(__dirname, '../out/404.html');

// Copy the custom index.html to the out directory
console.log('Copying custom index.html to out directory...');
fs.copyFileSync(customIndexPath, outIndexPath);
console.log('Custom index.html copied successfully!');

// Also copy it to 404.html
console.log('Copying custom index.html to 404.html...');
fs.copyFileSync(customIndexPath, out404Path);
console.log('Custom index.html copied to 404.html successfully!');
