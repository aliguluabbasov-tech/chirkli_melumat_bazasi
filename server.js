'use strict';

// Rəhbərlik paneli üçün lokal server. Yalnız daxili modullar: http, path, fs.
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const ROOT = __dirname;

// Yalnız bu fayllar brauzerə verilir (qovluqdakı digər fayllar gizli qalır).
const ROUTES = {
  '/': { file: 'dashboard.html', type: 'text/html; charset=utf-8' },
  '/dashboard.html': { file: 'dashboard.html', type: 'text/html; charset=utf-8' },
  '/audit_report.json': { file: 'audit_report.json', type: 'application/json; charset=utf-8' },
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const route = ROUTES[pathname];

  if (req.method !== 'GET' || !route) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Tapılmadı');
    return;
  }

  fs.readFile(path.join(ROOT, route.file), (err, data) => {
    if (err) {
      const message = route.file === 'audit_report.json'
        ? 'audit_report.json tapılmadı. Əvvəlcə "node auditor.js" əmrini işə salın.'
        : 'Server xətası: ' + route.file + ' oxuna bilmədi.';
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(message);
      return;
    }
    res.writeHead(200, { 'Content-Type': route.type, 'Cache-Control': 'no-store' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Reyestr Auditoru paneli işləyir: http://localhost:${PORT}`);
});
