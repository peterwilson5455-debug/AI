# Shadowfolio

Shadowfolio is a small terminal-like web UI that queries Google Custom Search, Wikipedia, and DuckDuckGo via a backend proxy. This repo bundles the frontend and backend so you can deploy a single app and keep API keys secret.

## Files
- `server.js` - Express server that serves the frontend and exposes API proxy endpoints
- `public/index.html` - Frontend UI
- `package.json` - Node project config
- `.env.example` - Example environment variables

## Setup (local)
1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
# then edit .env and add GOOGLE_API_KEY and SEARCH_ENGINE_ID
```

3. Start the server:

```bash
npm start
```

Open `http://localhost:5000` in your browser.

## Notes

* **Do not** commit your `.env` file to GitHub. It's included in `.gitignore`.
* To deploy, connect this repo to a platform like **Render**, **Railway**, or **Heroku**. They allow you to set environment variables in the dashboard.

## One-click deploy (optional)

I can add a Render `render.yaml` or Heroku/Procfile if you want — tell me which provider and I'll add it.

```
```

---

# Next steps

1. Copy the file contents above into the same structure on your machine (or download this document and copy/paste).
2. Create a repo on GitHub and push.
3. Create a `.env` from `.env.example` and add your real keys.
4. Run `npm install` and `npm start`.

If you want, I can now:

* Add a `render.yaml` for 1-click deploy to Render, **or**
* Add a `Procfile` and `app.json` for Heroku, **or**
* Generate a ZIP of this project for you to download.

Tell me which of the above you want next and I will add it.
