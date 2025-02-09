// Add error handlers for EIO errors on stdout and stderr
process.stdout.on("error", (err) => {
  if (err.code === "EIO") return;
  throw err;
});
process.stderr.on("error", (err) => {
  if (err.code === "EIO") return;
  throw err;
});

import { app, BrowserWindow, ipcMain, protocol, net } from "electron";
import path from "path";
import url from "url";
import { stat } from "node:fs/promises";
import { startGoosed } from "./goosed";
import log from "./utils/logger";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
import electronSquirrelStartup from "electron-squirrel-startup";
if (electronSquirrelStartup) app.quit();

// Only one instance of the electron main process should be running due to how chromium works.
// If another instance of the main process is already running `app.requestSingleInstanceLock()`
// will return false, `app.quit()` will be called, and the other instances will receive a
// 'second-instance' event.
// https://www.electronjs.org/docs/latest/api/app#apprequestsingleinstancelockadditionaldata
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

// This event will be called when a second instance of the app tries to run.
// https://www.electronjs.org/docs/latest/api/app#event-second-instance
app.on("second-instance", (event, args, workingDirectory, additionalData) => {
  createWindow();
});

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

async function createWindow() {
  // Start the Goose server first
  let port, working_dir;
  try {
    [port, working_dir] = await startGoosed(app);
    log.info(
      `Goose server started on port ${port} in directory ${working_dir}`
    );
  } catch (error) {
    log.error("Failed to start Goose server:", error);
    app.quit();
    return;
  }

  // Always use the built CJS file for preload
  const preloadPath = path.join(app.getAppPath(), ".vite/main/preload.cjs");
  log.info("Creating window with preload script:", preloadPath);
  log.info("Current directory:", process.cwd());
  log.info("import.meta.dirname:", import.meta.dirname);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: path.join(staticAssetsFolder, "/icon.png"),
    x: 2048,
    y: 40,
    width: 1800,
    height: 1060,
    minWidth: 400,
    minHeight: 200,
    backgroundColor: "#374151",
    show: false,
    webPreferences: {
      preload: preloadPath,
      additionalArguments: [
        JSON.stringify({
          GOOSE_PORT: port,
          GOOSE_WORKING_DIR: working_dir,
          GOOSE_API_HOST: "http://127.0.0.1",
          secretKey: "dev-key",
        }),
      ],
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // Required for preload scripts in some cases
    },
  });

  // Log window creation
  log.info("Window created, loading content...");

  if (import.meta.env.DEV) {
    log.info("Loading dev server URL:", VITE_DEV_SERVER_URLS["main_window"]);
    mainWindow.loadURL(VITE_DEV_SERVER_URLS["main_window"]);
  } else {
    log.info("Loading production URL: app://-/");
    mainWindow.loadURL("app://-/");
  }

  mainWindow.on("ready-to-show", () => {
    log.info("Window ready to show");
    mainWindow.show();
    if (import.meta.env.DEV) {
      log.info("Opening DevTools in dev mode");
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("toggleDevTools", (event) => event.sender.toggleDevTools());
ipcMain.on("setTitleBarColors", (event, bgColor, iconColor) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window === null) return;

  // MacOS title bar overlay buttons do not need styling so the function is undefined
  if (window.setTitleBarOverlay === undefined) return;

  window.setTitleBarOverlay({
    color: bgColor,
    symbolColor: iconColor,
    height: 40,
  });
});
