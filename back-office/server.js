// server.js
const http = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

// Passenger akan set PORT sendiri. Jangan pakai process.env.port (kecil).
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Next app running on :${port} (dev=${dev})`);
  });
});
