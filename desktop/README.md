## Windows desktop app plan

This repository will use the existing web client in `client/` as the UI for a
Windows desktop application.

### Approach

- Use **Electron** to host the web client in a native window.
- The Electron app will:
  - Load the production build of the web client (or point to the running dev server during development).
  - Integrate with the system tray and window menus if desired.
  - Re-use the same authentication, REST, and WebSocket endpoints as the browser.

### Minimal Electron skeleton (to be implemented later)

The future implementation will consist of:

- `desktop/package.json` – Electron dependencies and scripts.
- `desktop/main.ts` – Electron main process that:
  - Creates a `BrowserWindow`.
  - Loads `http://localhost:5173` in development, or `file://.../index.html` from the built `client/` in production.
- `desktop/preload.ts` – optional preload script for limited native integrations.

No Electron code is added yet; this document records the agreed plan and folder
for future work.

