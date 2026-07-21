const express = require('express');
const next = require('next');
const dns = require('dns');

// ─── OVERRIDE DNS ─────────────────────────────────────────────────────────────
// Explicitly use Google and Cloudflare DNS to bypass ISP blocking for MongoDB.
// This is executed before Next.js or Mongoose tries to resolve SRV records.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log('✅ Custom DNS servers set for Express backend.');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Next.js parses the body itself, so we don't use express.json() globally

  // Pass all API and page requests to the Next.js handler
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
