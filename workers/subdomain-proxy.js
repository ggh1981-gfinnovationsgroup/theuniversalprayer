/**
 * Cloudflare Worker — Subdomain Proxy
 * theuniversalprayer.com
 *
 * How it works:
 *   misericordia.theuniversalprayer.com  →  theuniversalprayer.com/intercesor/?intercesor=misericordia
 *   padrepio.theuniversalprayer.com      →  theuniversalprayer.com/intercesor/?intercesor=padrepio
 *   (all assets, data, JS, CSS are proxied transparently)
 *
 * Deploy:
 *   1. Install Wrangler: npm install -g wrangler
 *   2. wrangler login
 *   3. cd workers && wrangler deploy
 *
 * Route to set in Cloudflare Dashboard:
 *   Pattern:  *.theuniversalprayer.com/*
 *   Worker:   theuniversalprayer-subdomain-proxy
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const parts = url.hostname.split('.');

    // Only handle *.theuniversalprayer.com (skip www and root)
    if (
      parts.length === 3 &&
      parts[1] === 'theuniversalprayer' &&
      parts[2] === 'com' &&
      parts[0] !== 'www'
    ) {
      const intercesor = parts[0];
      const newUrl = new URL(request.url);
      newUrl.hostname = 'theuniversalprayer.com';

      // Root path → serve the intercessor template with query param
      if (url.pathname === '/' || url.pathname === '') {
        newUrl.pathname = '/intercesor/';
        newUrl.searchParams.set('intercesor', intercesor);
      }
      // All other paths (/assets/, /data/, etc.) → proxy straight through

      return fetch(newUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow',
      });
    }

    // Root domain and www → pass through normally
    return fetch(request);
  },
};
