import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

console.log("🔄 Preload script starting...");

// Get config from command line arguments
const config = (() => {
  try {
    console.log("📝 Reading config from process.argv:", process.argv);
    const configArg = process.argv.find((arg) => arg.startsWith("{"));
    console.log("📦 Found config arg:", configArg);
    return JSON.parse(configArg || "{}");
  } catch (error) {
    console.error("❌ Error parsing config:", error);
    return {};
  }
})();

console.log("⚙️ Parsed config:", config);

// Define the APIs
const electronAPI = {
  getConfig: () => {
    console.log("📤 Returning config:", config);
    return config;
  },
  toggleDevTools: () => ipcRenderer.send("toggleDevTools"),
  setTitleBarColors: (bgColor: string, iconColor: string) => {
    document.documentElement.style.background = bgColor;
    ipcRenderer.send("setTitleBarColors", bgColor, iconColor);
  },
  logInfo: (txt: string) => ipcRenderer.send("logInfo", txt),
  // Add missing methods
  on: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => {
    ipcRenderer.on(channel, callback);
  },
  off: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => {
    ipcRenderer.off(channel, callback);
  },
  getBinaryPath: (binaryName: string) =>
    ipcRenderer.invoke("get-binary-path", binaryName),
  hideWindow: () => ipcRenderer.send("hide-window"),
  directoryChooser: (replace: string) =>
    ipcRenderer.send("directory-chooser", replace),
  createChatWindow: (query?: string, dir?: string, version?: string) =>
    ipcRenderer.send("create-chat-window", query, dir, version),
  showNotification: (data: any) => ipcRenderer.send("notify", data),
  createWingToWingWindow: (query: string) =>
    ipcRenderer.send("create-wing-to-wing-window", query),
  openInChrome: (url: string) => ipcRenderer.send("open-in-chrome", url),
  fetchMetadata: (url: string) => ipcRenderer.invoke("fetch-metadata", url),
  reloadApp: () => ipcRenderer.send("reload-app"),
  checkForOllama: () => ipcRenderer.invoke("check-ollama"),
  selectFileOrDirectory: () => ipcRenderer.invoke("select-file-or-directory"),
  startPowerSaveBlocker: () => ipcRenderer.invoke("start-power-save-blocker"),
  stopPowerSaveBlocker: () => ipcRenderer.invoke("stop-power-save-blocker"),
};

const appConfigAPI = {
  get: (key: string) => config[key],
  getAll: () => config,
};

try {
  console.log("🔄 Exposing APIs to renderer process...");
  // Expose the APIs
  contextBridge.exposeInMainWorld("electron", electronAPI);
  contextBridge.exposeInMainWorld("appConfig", appConfigAPI);
  console.log("✅ Preload script completed successfully");
} catch (error) {
  console.error("❌ Error in preload script:", error);
  throw error;
}

// Type declaration for TypeScript
declare global {
  interface Window {
    electron: typeof electronAPI;
    appConfig: typeof appConfigAPI;
  }
}
