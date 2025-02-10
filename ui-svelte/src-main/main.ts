// Error handlers for EIO errors
process.stdout.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EIO") return;
  throw err;
});
process.stderr.on("error", (err: NodeJS.ErrnoException) => {
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
  screen,
  shell,
} from "electron";
import path from "path";
import url from "url";
import { stat } from "node:fs/promises";
import electronSquirrelStartup from "electron-squirrel-startup";
import { startGoosed } from "./goosed";
import log from "./utils/logger";
import { loadRecentDirs } from "./utils/recentDirs";

import type { WindowType, IpcEvents } from "./types/ipc";
import type { GooseProcess, GooseResult } from "./types/process";

// Prevent multiple instances
if (!app.requestSingleInstanceLock() || electronSquirrelStartup) {
  app.quit();
}

// Constants
const scheme = "app";
const srcFolder = path.join(app.getAppPath(), `.vite/main_window/`);
const staticAssetsFolder = import.meta.env.DEV
  ? path.join(import.meta.dirname, "../../static/")
  : srcFolder;

// Helper functions
async function isFile(filePath: string): Promise<string | undefined> {
  try {
    if ((await stat(filePath)).isFile()) return filePath;
  } catch (e) {
    return undefined;
  }
}

let windowCounter = 0;

function createTray(): Tray {
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

function showWindow(): void {
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

    if (!win.isVisible()) win.show();
    win.focus();
  });
}

async function createLauncher(): Promise<void> {
  const launcherWindow = new BrowserWindow({
    width: 600,
    height: 60,
    frame: false,
    transparent: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), ".vite/main/preload.cjs"),
      additionalArguments: [
        JSON.stringify({ type: "launcher" } satisfies WindowType),
      ],
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    skipTaskbar: true,
    alwaysOnTop: true,
  });

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const windowBounds = launcherWindow.getBounds();

  launcherWindow.setPosition(
    Math.round(width / 2 - windowBounds.width / 2),
    Math.round(height / 3 - windowBounds.height / 2)
  );

  if (import.meta.env.DEV) {
    await launcherWindow.loadURL(
      `${VITE_DEV_SERVER_URLS["main_window"]}?window=launcher`
    );
  } else {
    await launcherWindow.loadURL("app://-/?window=launcher");
  }

  launcherWindow.on("blur", () => {
    launcherWindow.destroy();
  });
}

async function createChat(
  query?: string,
  dir?: string,
  version?: string
): Promise<BrowserWindow> {
  try {
    const [port, working_dir] = await startGoosed(app, dir);
    log.info(
      `Goose server started on port ${port} in directory ${working_dir}`
    );

    const mainWindow = new BrowserWindow({
      x: 2048,
      y: 0,
      width: 1800,
      height: 1000,
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
          } satisfies WindowType),
        ],
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
    });

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width } = primaryDisplay.workAreaSize;
    windowCounter++;
    const direction = windowCounter % 2 === 0 ? 1 : -1;
    const initialOffset = 50;
    const baseXPosition = Math.round(width / 2 - mainWindow.getSize()[0] / 2);
    const xOffset = direction * initialOffset * Math.floor(windowCounter / 2);
    mainWindow.setPosition(baseXPosition + xOffset, 100);

    const queryParam = query
      ? `?initialQuery=${encodeURIComponent(query)}`
      : "";
    if (import.meta.env.DEV) {
      await mainWindow.loadURL(
        `${VITE_DEV_SERVER_URLS["main_window"]}${queryParam}`
      );
    } else {
      await mainWindow.loadURL(`app://-/${queryParam}`);
    }

    mainWindow.on("ready-to-show", () => {
      mainWindow.show();
      if (import.meta.env.DEV) {
        mainWindow.webContents.openDevTools();
      }
    });

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
  } catch (error) {
    log.error("Failed to start Goose server:", error);
    app.quit();
    throw error;
  }
}

// Protocol registration
protocol.registerSchemesAsPrivileged([
  {
    scheme,
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

    return net.fetch(url.pathToFileURL(responseFilePath).toString());
  });
});

// App initialization
app.whenReady().then(async () => {
  createTray();
  const recentDirs = loadRecentDirs();
  const openDir = recentDirs.length > 0 ? recentDirs[0] : undefined;
  await createChat(undefined, openDir);

  globalShortcut.register("Control+Alt+Command+G", createLauncher);

  // Type-safe IPC event handlers
  ipcMain.on("create-chat-window", ((_, query, dir, version) => {
    createChat(query, dir, version);
  }) as IpcEvents["create-chat-window"]);

  ipcMain.on("directory-chooser", ((_, replace = false) => {
    // TODO: Implement directory chooser
  }) as IpcEvents["directory-chooser"]);

  ipcMain.on("logInfo", ((_, info) => {
    log.info("from renderer:", info);
  }) as IpcEvents["logInfo"]);

  ipcMain.on("reload-app", (() => {
    app.relaunch();
    app.exit(0);
  }) as IpcEvents["reload-app"]);
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
ipcMain.on("toggleDevTools", ((event) =>
  event.sender.toggleDevTools()) as IpcEvents["toggleDevTools"]);
ipcMain.on("setTitleBarColors", ((event, bgColor, iconColor) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window?.setTitleBarOverlay) return;

  window.setTitleBarOverlay({
    color: bgColor,
    symbolColor: iconColor,
    height: 40,
  });
}) as IpcEvents["setTitleBarColors"]);

// Add handler for opening URLs in default browser
ipcMain.on("open-in-chrome", (_, url) => {
  shell.openExternal(url).catch((err) => {
    log.error("Failed to open URL in browser:", err);
  });
});
