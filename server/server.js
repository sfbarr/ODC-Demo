// server/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// For resolving __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


// Serve static files (like CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, '..', 'public')));


app.on('connection', (stream) => {
  console.log('someone connected!');
});


// Serve index.html at "/" and "/index.html"
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// (Optional) Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Basic error handler (optional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});