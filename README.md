# Nuana

Nuana is a mood-based outfit recommendation web app for unisex, women, and men presentation preferences.

## Start

```powershell
npm start
```

Then open `http://localhost:4173`.

## API

- `GET /api/health`
- `GET /api/moods`
- `GET /api/recommendations?mood=happy&gender=unisex&weather=mild&occasion=everyday`
- `GET /api/saved`
- `POST /api/saved`
- `DELETE /api/saved/:name`
- `POST /api/history`
- `POST /api/feedback`

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for the implementation record and roadmap.
