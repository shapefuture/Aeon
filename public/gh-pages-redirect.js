// This script helps with GitHub Pages routing for SPAs
(function() {
  // Get the current path excluding the repo name
  const path = window.location.pathname.replace(/^\/Aeon/, '');

  // If we have a path and it's not a file (no extension), redirect to the base URL
  // GitHub Pages will serve index.html, and then Next.js will handle the routing
  if (path && path !== '/' && !path.includes('.')) {
    window.location.href = '/Aeon' + (window.location.search || '');
  }
})();
