#!/usr/bin/env node

/**
 * Script to generate the final index.html file with the correct asset paths
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define paths
const outDir = path.join(__dirname, '../out');
const templatePath = path.join(__dirname, '../public/index-template.html');

// Read the template
let template = fs.readFileSync(templatePath, 'utf8');

// Find the CSS file
const cssFiles = glob.sync(path.join(outDir, '_next/static/css/*.css'));
if (cssFiles.length > 0) {
  const cssFile = path.basename(cssFiles[0]);
  template = template.replace(/CSSPLACEHOLDER/g, cssFile);
} else {
  console.warn('No CSS file found');
  template = template.replace(/CSSPLACEHOLDER/g, '');
}

// Find the webpack file
const webpackFiles = glob.sync(path.join(outDir, '_next/static/chunks/webpack-*.js'));
if (webpackFiles.length > 0) {
  const webpackFile = path.basename(webpackFiles[0]).replace('webpack-', '');
  template = template.replace(/WEBPACKPLACEHOLDER/g, webpackFile);
} else {
  console.warn('No webpack file found');
  template = template.replace(/WEBPACKPLACEHOLDER/g, '');
}

// Find the main-app file
const mainAppFiles = glob.sync(path.join(outDir, '_next/static/chunks/main-app-*.js'));
if (mainAppFiles.length > 0) {
  const mainAppFile = path.basename(mainAppFiles[0]).replace('main-app-', '');
  template = template.replace(/MAINAPPPLACEHOLDER/g, mainAppFile);
} else {
  console.warn('No main-app file found');
  template = template.replace(/MAINAPPPLACEHOLDER/g, '');
}

// Find the page file
const pageFiles = glob.sync(path.join(outDir, '_next/static/chunks/app/page-*.js'));
if (pageFiles.length > 0) {
  const pageFile = path.basename(pageFiles[0]).replace('page-', '');
  template = template.replace(/PAGEPLACEHOLDER/g, pageFile);
} else {
  console.warn('No page file found');
  template = template.replace(/PAGEPLACEHOLDER/g, '');
}

// Find the index page file
const indexPageFiles = glob.sync(path.join(outDir, '_next/static/chunks/pages/index-*.js'));
if (indexPageFiles.length > 0) {
  const indexPageFile = path.basename(indexPageFiles[0]).replace('index-', '');
  template = template.replace(/INDEXPAGEPLACEHOLDER/g, indexPageFile);
} else {
  console.warn('No index page file found');
  template = template.replace(/INDEXPAGEPLACEHOLDER/g, '');
}

// Write the final index.html file
fs.writeFileSync(path.join(outDir, 'index.html'), template);
console.log('Generated index.html file successfully!');

// Also create a copy for the 404.html file
fs.writeFileSync(path.join(outDir, '404.html'), template);
console.log('Generated 404.html file successfully!');
