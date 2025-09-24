// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Paths (needed because of ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load secret keys
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

app.use(cors());
app.use(express.json());

// --- Serve frontend (static files in ./public) ---
app.use(express.static(path.join(__dirname, "public")));

// --- Google Search Proxy ---
app.get("/api/search/google", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing query" });
  if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) return res.status(500).json({ error: 'Server misconfigured: missing API key or search engine ID' });

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(q)}`;
    const resp = await fetch(url);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error('Google proxy error', err);
    res.status(500).json({ error: "Google API error", details: err.message });
  }
});

// --- Wikipedia Proxy ---
app.get("/api/search/wiki", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing query" });

  try {
    const sUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&utf8=1&srlimit=1&origin=*`;
    const sresp = await fetch(sUrl);
    const sjson = await sresp.json();

    if (!sjson.query?.search?.length) return res.json({});

    const title = sjson.query.search[0].title;
    const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const sumResp = await fetch(sumUrl);
    const sumJson = await sumResp.json();
    res.json(sumJson);
  } catch (err) {
    console.error('Wiki proxy error', err);
    res.status(500).json({ error: "Wiki error", details: err.message });
  }
});

// --- DuckDuckGo Proxy ---
app.get("/api/search/ddg", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing query" });

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
    const resp = await fetch(url);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error('DDG proxy error', err);
    res.status(500).json({ error: "DDG error", details: err.message });
  }
});

// --- Health check ---
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- Catch-all: serve frontend ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Shadowfolio running at http://localhost:${PORT}`));
