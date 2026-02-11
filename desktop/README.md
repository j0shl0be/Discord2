# Desktop app (Electron)

A minimal Electron wrapper that loads the web client in a native window.

## Setup

1. Install dependencies:
   ```bash
   cd desktop && npm install
   ```

2. Start your web client (from `client/`):
   ```bash
   cd ../client && npm run dev
   ```

3. Run the desktop app:
   ```bash
   cd ../desktop && npm start
   ```

The desktop app loads `http://localhost:5173` by default. Set `CLIENT_URL` to point at your deployed client if needed.

## Building for Windows

```bash
npm run build:win
```

Output will be in `desktop/dist/`. Add an `icon.ico` for the app icon.

## Future improvements

- Tray icon and minimize to tray
- Auto-updater (electron-updater)
- Custom app menu
- Deep links (e.g. `homeserver://` for OAuth)
