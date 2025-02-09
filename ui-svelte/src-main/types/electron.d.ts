import type { IpcRendererEvent } from "electron";

export interface ElectronAPI {
  // Config
  getConfig: () => Record<string, any>;

  // Window management
  hideWindow: () => void;
  directoryChooser: (replace: boolean) => void;
  createChatWindow: (query?: string, dir?: string, version?: string) => void;

  // UI
  toggleDevTools: () => void;
  setTitleBarColors: (bgColor: string, iconColor: string) => void;

  // Logging
  logInfo: (txt: string) => void;
  showNotification: (data: any) => void;

  // App management
  reloadApp: () => void;

  // Event handling
  on: (channel: string, callback: Function) => void;
  off: (channel: string, callback: Function) => void;

  // Power management
  startPowerSaveBlocker: () => Promise<number>;
  stopPowerSaveBlocker: () => Promise<void>;

  // Utility methods
  getBinaryPath: (binaryName: string) => Promise<string>;
  createWingToWingWindow: (query: string) => void;
  openInChrome: (url: string) => void;
  fetchMetadata: (url: string) => Promise<any>;
  checkForOllama: () => Promise<boolean>;
  selectFileOrDirectory: () => Promise<string>;
}

// Expose these types to the renderer process
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
