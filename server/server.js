// server/server.js
import { fileURLToPath } from 'url';
import express from 'express';
import path from 'path';
import 'dotenv/config';

// For resolving __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

import { Pool } from 'pg';
const db = new Pool();



// Serve static files (like CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, '..', 'public')));


app.on('connection', (stream) => {
  console.log('someone connected!');
});


// Serve index.html at "/" and "/index.html"
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


// Sanity check endpoint
app.get('/hello', (req,res) => { console.log('hit /hello'); res.send('hi'); });


app.get('/data', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM sci_grants');
    res.json(result.rows); // send rows as JSON to frontend
  } catch (err) {
    console.error('Error querying DB:', err);
    res.status(500).send('Something went wrong.');
  }
});


// (Optional) Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
  res.send('<p>Hello Citizen!</p>');
});

// Basic error handler (optional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});