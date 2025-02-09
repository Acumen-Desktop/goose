// Add error handlers for EIO errors on stdout and stderr
process.stdout.on("error", (err) => {
  if (err.code === "EIO") return;
  throw err;
});
process.stderr.on("error", (err) => {
  if (err.code === "EIO") return;
  throw err;
});

import {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  net,
  Tray,
  Menu,
  globalShortcut,
} from "electron";
import path from "path";
import url from "url";
import { stat } from "node:fs/promises";
import { startGoosed } from "./goosed";
import log from "./utils/logger";
import { loadRecentDirs, addRecentDir } from "./utils/recentDirs";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
import electronSquirrelStartup from "electron-squirrel-startup";
if (electronSquirrelStartup) app.quit();

// Only one instance allowed
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

// Window counter for positioning
let windowCounter = 0;

// Create tray icon
function createTray() {
  const isDev = import.meta.env.DEV;
  const iconPath = path.join(staticAssetsFolder, "iconTemplate.png");
  const tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Show Window", click: showWindow },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setToolTip("Goose");
  tray.setContextMenu(contextMenu);
  return tray;
}

// Show/focus window
function showWindow() {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) {
    log.info("No windows are currently open.");
    return;
  }

  const initialOffsetX = 30;
  const initialOffsetY = 30;

  windows.forEach((win, index) => {
    const currentBounds = win.getBounds();
    win.setBounds({
      x: currentBounds.x + initialOffsetX * index,
      y: currentBounds.y + initialOffsetY * index,
      width: currentBounds.width,
      height: currentBounds.height,
    });

    if (!win.isVisible()) {
      win.show();
    }
    win.focus();
  });
}

// Create launcher window
async function createLauncher() {
  const launcherWindow = new BrowserWindow({
    width: 600,
    height: 60,
    frame: false,
    transparent: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), ".vite/main/preload.cjs"),
      additionalArguments: [JSON.stringify({ type: "launcher" })],
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    skipTaskbar: true,
    alwaysOnTop: true,
  });

  // Center on screen
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const windowBounds = launcherWindow.getBounds();

  launcherWindow.setPosition(
    Math.round(width / 2 - windowBounds.width / 2),
    Math.round(height / 3 - windowBounds.height / 2)
  );

  // Load launcher window content
  if (import.meta.env.DEV) {
    await launcherWindow.loadURL(
      `${VITE_DEV_SERVER_URLS["main_window"]}?window=launcher`
    );
  } else {
    await launcherWindow.loadURL("app://-/?window=launcher");
  }

  // Destroy window when it loses focus
  launcherWindow.on("blur", () => {
    launcherWindow.destroy();
  });
}

// Create chat window
async function createChat(query?: string, dir?: string, version?: string) {
  // Start the Goose server first
  let port, working_dir;
  try {
    [port, working_dir] = await startGoosed(app, dir);
    log.info(
      `Goose server started on port ${port} in directory ${working_dir}`
    );
  } catch (error) {
    log.error("Failed to start Goose server:", error);
    app.quit();
    return;
  }

  // Window configuration
  const mainWindow = new BrowserWindow({
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 16, y: 10 },
    vibrancy: "window",
    width: 750,
    height: 800,
    minWidth: 650,
    backgroundColor: "#374151",
    icon: path.join(staticAssetsFolder, "icon.png"),
    webPreferences: {
      preload: path.join(app.getAppPath(), ".vite/main/preload.cjs"),
      additionalArguments: [
        JSON.stringify({
          type: "chat",
          GOOSE_PORT: port,
          GOOSE_WORKING_DIR: working_dir,
          GOOSE_API_HOST: "http://127.0.0.1",
          REQUEST_DIR: dir,
          secretKey: "dev-key",
        }),
      ],
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Increment window counter and position window
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  windowCounter++;
  const direction = windowCounter % 2 === 0 ? 1 : -1;
  const initialOffset = 50;
  const baseXPosition = Math.round(width / 2 - mainWindow.getSize()[0] / 2);
  const xOffset = direction * initialOffset * Math.floor(windowCounter / 2);
  mainWindow.setPosition(baseXPosition + xOffset, 100);

  // Load content with query params
  const queryParam = query ? `?initialQuery=${encodeURIComponent(query)}` : "";
  if (import.meta.env.DEV) {
    await mainWindow.loadURL(
      `${VITE_DEV_SERVER_URLS["main_window"]}${queryParam}`
    );
  } else {
    await mainWindow.loadURL(`app://-/${queryParam}`);
  }

  // Show window when ready
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    if (import.meta.env.DEV) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Log any window errors
  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      log.error("Window failed to load:", errorCode, errorDescription);
    }
  );

  mainWindow.webContents.on("console-message", (event, level, message) => {
    log.info("Renderer Console:", message);
  });

  return mainWindow;
}

// Protocol registration
const scheme = "app";
const srcFolder = path.join(app.getAppPath(), `.vite/main_window/`);
const staticAssetsFolder = import.meta.env.DEV
  ? path.join(import.meta.dirname, "../../static/")
  : srcFolder;

protocol.registerSchemesAsPrivileged([
  {
    scheme: scheme,
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: false,
    },
  },
]);

app.on("ready", () => {
  protocol.handle(scheme, async (request) => {
    const requestPath = path.normalize(
      decodeURIComponent(new URL(request.url).pathname)
    );

    async function isFile(filePath: string) {
      try {
        if ((await stat(filePath)).isFile()) return filePath;
      } catch (e) {}
    }

    const responseFilePath =
      (await isFile(path.join(srcFolder, requestPath))) ??
      (await isFile(
        path.join(
          srcFolder,
          path.dirname(requestPath),
          `${path.basename(requestPath) || "index"}.html`
        )
      )) ??
      path.join(srcFolder, "200.html");

    return await net.fetch(url.pathToFileURL(responseFilePath).toString());
  });
});

// App initialization
app.whenReady().then(async () => {
  // Create tray and initial window
  createTray();
  const recentDirs = loadRecentDirs();
  let openDir = recentDirs.length > 0 ? recentDirs[0] : undefined;
  await createChat(undefined, openDir);

  // Register global shortcuts
  globalShortcut.register("Control+Alt+Command+G", createLauncher);

  // Handle IPC events
  ipcMain.on("create-chat-window", (_, query, dir, version) => {
    createChat(query, dir, version);
  });

  ipcMain.on("directory-chooser", (_, replace: boolean = false) => {
    // TODO: Implement directory chooser
  });

  ipcMain.on("logInfo", (_, info) => {
    log.info("from renderer:", info);
  });

  ipcMain.on("reload-app", () => {
    app.relaunch();
    app.exit(0);
  });
});

// Window management
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createChat();
  }
});

// IPC handlers
ipcMain.on("toggleDevTools", (event) => event.sender.toggleDevTools());
ipcMain.on("setTitleBarColors", (event, bgColor, iconColor) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window === null) return;

  if (window.setTitleBarOverlay === undefined) return;

  window.setTitleBarOverlay({
    color: bgColor,
    symbolColor: iconColor,
    height: 40,
  });
});
