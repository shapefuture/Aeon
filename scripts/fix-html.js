#!/usr/bin/env node

/**
 * Script to fix HTML files after build
 */

const fs = require('fs');
const path = require('path');

// Define paths
const outDir = path.join(__dirname, '../out');

// Function to fix HTML files
function fixHtmlFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // Recursively process subdirectories
      fixHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      console.log(`Processing ${filePath}`);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix paths to static assets
      content = content.replace(/"\/_next\//g, '"_next/');
      
      // Fix paths to icons
      content = content.replace(/"\/icons\//g, '"icons/');
      
      // Fix paths to manifest and other root files
      content = content.replace(/"\/manifest.json"/g, '"manifest.json"');
      content = content.replace(/"\/favicon.ico"/g, '"favicon.ico"');
      
      // Fix paths to service worker
      content = content.replace(/"\/sw.js"/g, '"sw.js"');
      
      // Write the fixed content back to the file
      fs.writeFileSync(filePath, content);
      console.log(`Fixed paths in ${filePath}`);
    }
  });
}

// Start processing
console.log('Fixing HTML files...');
fixHtmlFiles(outDir);
console.log('HTML files fixed successfully!');
