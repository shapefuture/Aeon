if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const o=e=>n(e,c),r={module:{uri:c},exports:t,require:o};s[c]=Promise.all(a.map((e=>r[e]||o(e)))).then((e=>(i(...e),t)))}}define(["./workbox-e9849328"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Aeon/_next/app-build-manifest.json",revision:"52af07bb122b2443040e64483c5aa9a5"},{url:"/Aeon/_next/static/chunks/01826c6a-c4d3a5a8baa13357.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/323-e6f28f552d5d0cb1.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/479f18de-3ab7ae0ca731c6e5.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/47edcb22-88cdbe56a27cf0a4.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/577-006ee5c29471cb74.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/91c6c604-76a0e8eb825e7da0.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/app/_not-found/page-7d083fdf4567c2f1.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/app/layout-fbb104b7d5b3bf1b.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/app/page-396a5f00c46dcde1.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/framework-289b5a20f31bf2b1.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/main-app-293280a50d46393d.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/main-f11533b080694dc6.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/pages/_app-7e5d4a60281b6427.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/pages/_error-77fa64d81664a8ec.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/Aeon/_next/static/chunks/webpack-eacd6218ca288207.js",revision:"ocauiNOZ61I7XuN-QSfrB"},{url:"/Aeon/_next/static/css/8e096e47d12b1af4.css",revision:"8e096e47d12b1af4"},{url:"/Aeon/_next/static/ocauiNOZ61I7XuN-QSfrB/_buildManifest.js",revision:"e172230fe2fe25af4eca4c67ac5ddc35"},{url:"/Aeon/_next/static/ocauiNOZ61I7XuN-QSfrB/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/Aeon/icons/icon-192x192.png",revision:"8eb9a960036deaa6da0a20924a7c51a1"},{url:"/Aeon/icons/icon-512x512.png",revision:"42b84e1eedd7970f8cef55aef3e1aeec"},{url:"/Aeon/icons/placeholder-logo.png",revision:"b7d4c7dd55cf683c956391f9c2ce3f5b"},{url:"/Aeon/icons/placeholder-user.jpg",revision:"82c9573f1276f9683ba7d92d8a8c6edd"},{url:"/Aeon/icons/placeholder.jpg",revision:"887632fd67dd19a0d58abde79d8e2640"},{url:"/Aeon/manifest.json",revision:"07841caa876dd60524c9d3f43296907f"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/Aeon",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
