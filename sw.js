if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const c=e=>n(e,t),r={module:{uri:t},exports:o,require:c};s[t]=Promise.all(a.map((e=>r[e]||c(e)))).then((e=>(i(...e),o)))}}define(["./workbox-e9849328"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/404.html",revision:"935c06fe748b2abfbe782a4d8f8a20ce"},{url:"/CNAME",revision:"04bb72b1b9502b399b56d63400bb2fd7"},{url:"/_next/app-build-manifest.json",revision:"9c66677bb9f2dc85aa566e6fa18e4cad"},{url:"/_next/static/A666iYooC6bI-AXWoP7p2/_buildManifest.js",revision:"900905b1fa35893d25c1b194cf0f0d89"},{url:"/_next/static/A666iYooC6bI-AXWoP7p2/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/01826c6a-c4d3a5a8baa13357.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/323-c1c0f4b58a2c5802.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/468-1fe2f796bee91efa.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/479f18de-3ab7ae0ca731c6e5.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/47edcb22-88cdbe56a27cf0a4.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/836-2c515332768a1719.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/91c6c604-76a0e8eb825e7da0.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/app/_not-found/page-d054b6c317b42683.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/app/layout-90ce019cf2a01a28.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/app/not-found-4bf6157492b2d622.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/app/page-6b64a1da507e2ad9.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/framework-289b5a20f31bf2b1.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/main-app-7eacf51e1230d173.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/main-ba8c17d0453a5a24.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/pages/_app-7e5d4a60281b6427.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/pages/_error-77fa64d81664a8ec.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-69a5d7732a2b51aa.js",revision:"A666iYooC6bI-AXWoP7p2"},{url:"/_next/static/css/4a1b648a5a4f56b6.css",revision:"4a1b648a5a4f56b6"},{url:"/custom-index.html",revision:"3d94c524708389726e37ac6b342e1206"},{url:"/gh-pages-redirect.js",revision:"9bf2b4bf75bbcf319a65841da03e7ef8"},{url:"/index-template.html",revision:"61ecf462a980aee3d046c3d6b4f3fd04"},{url:"/manifest.json",revision:"021b661c5c99216c32837c66acd8f075"},{url:"/standalone.html",revision:"95a2658b437653ade4009f265e27c5c7"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
