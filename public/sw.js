if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const o=e=>n(e,i),r={module:{uri:i},exports:c,require:o};s[i]=Promise.all(a.map((e=>r[e]||o(e)))).then((e=>(t(...e),c)))}}define(["./workbox-e9849328"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/aeon/_next/app-build-manifest.json",revision:"cf68906385fa39292a03153e6c225e34"},{url:"/aeon/_next/static/chunks/01826c6a-c4d3a5a8baa13357.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/323-6e3cf022b3334cd0.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/479f18de-3ab7ae0ca731c6e5.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/47edcb22-88cdbe56a27cf0a4.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/577-006ee5c29471cb74.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/91c6c604-76a0e8eb825e7da0.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/app/_not-found/page-7d083fdf4567c2f1.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/app/layout-fbb104b7d5b3bf1b.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/app/page-396a5f00c46dcde1.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/framework-289b5a20f31bf2b1.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/main-7b22fdf77db58df5.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/main-app-293280a50d46393d.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/pages/_app-7e5d4a60281b6427.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/pages/_error-77fa64d81664a8ec.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/aeon/_next/static/chunks/webpack-6ee0b3504feb4516.js",revision:"xsInLOEuJmvwMXVXM_6Fh"},{url:"/aeon/_next/static/css/8e096e47d12b1af4.css",revision:"8e096e47d12b1af4"},{url:"/aeon/_next/static/xsInLOEuJmvwMXVXM_6Fh/_buildManifest.js",revision:"e43cc6b8c8a162b3fa76e6e97fadc46f"},{url:"/aeon/_next/static/xsInLOEuJmvwMXVXM_6Fh/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/aeon/icons/icon-192x192.png",revision:"8eb9a960036deaa6da0a20924a7c51a1"},{url:"/aeon/icons/icon-512x512.png",revision:"42b84e1eedd7970f8cef55aef3e1aeec"},{url:"/aeon/icons/placeholder-logo.png",revision:"b7d4c7dd55cf683c956391f9c2ce3f5b"},{url:"/aeon/icons/placeholder-user.jpg",revision:"82c9573f1276f9683ba7d92d8a8c6edd"},{url:"/aeon/icons/placeholder.jpg",revision:"887632fd67dd19a0d58abde79d8e2640"},{url:"/aeon/manifest.json",revision:"021b661c5c99216c32837c66acd8f075"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/aeon",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
