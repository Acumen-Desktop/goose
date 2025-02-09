import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "./types/electron";

console.log("🔄 Preload script starting...");

// Get config from main process
const config = JSON.parse(process.argv[process.argv.length - 1]);

console.log("⚙️ Parsed config:", config);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  // Config
  getConfig: () => config,

  // Window management
  hideWindow: () => ipcRenderer.send("hide-window"),
  directoryChooser: (replace: boolean) =>
    ipcRenderer.send("directory-chooser", replace),
  createChatWindow: (query?: string, dir?: string, version?: string) =>
    ipcRenderer.send("create-chat-window", query, dir, version),

  // UI
  toggleDevTools: () => ipcRenderer.send("toggleDevTools"),
  setTitleBarColors: (bgColor: string, iconColor: string) =>
    ipcRenderer.send("setTitleBarColors", bgColor, iconColor),

  // Logging
  logInfo: (txt: string) => ipcRenderer.send("logInfo", txt),
  showNotification: (data: any) => ipcRenderer.send("notify", data),

  // App management
  reloadApp: () => ipcRenderer.send("reload-app"),

  // Event handling
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },
  off: (channel: string, callback: Function) => {
    ipcRenderer.off(channel, (_, ...args) => callback(...args));
  },

  // Power management
  startPowerSaveBlocker: () => ipcRenderer.invoke("start-power-save-blocker"),
  stopPowerSaveBlocker: () => ipcRenderer.invoke("stop-power-save-blocker"),

  // Utility methods
  getBinaryPath: (binaryName: string) =>
    ipcRenderer.invoke("get-binary-path", binaryName),
  createWingToWingWindow: (query: string) =>
    ipcRenderer.send("create-wing-to-wing-window", query),
  openInChrome: (url: string) => ipcRenderer.send("open-in-chrome", url),
  fetchMetadata: (url: string) => ipcRenderer.invoke("fetch-metadata", url),
  checkForOllama: () => ipcRenderer.invoke("check-ollama"),
  selectFileOrDirectory: () => ipcRenderer.invoke("select-file-or-directory"),
};

// Expose the APIs
contextBridge.exposeInMainWorld("electron", electronAPI);

// AppConfig API for compatibility
const appConfigAPI = {
  getAll: () => config,
};
contextBridge.exposeInMainWorld("appConfig", appConfigAPI);

try {
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
