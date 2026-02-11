const { app, BrowserWindow } = require("electron");
const path = require("path");

// Configure the URL of your web client. For local dev, use the Vite dev server.
// For production, use your deployed client URL.
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "icon.png"),
  });

  win.loadURL(CLIENT_URL);
  win.on("closed", () => app.quit());
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
