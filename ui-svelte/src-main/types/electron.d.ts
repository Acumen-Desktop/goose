import type { IpcRendererEvent } from "electron";

export interface ElectronAPI {
  getConfig: () => Record<string, any>;
  hideWindow: () => void;
  directoryChooser: (replace: string) => void;
  createChatWindow: (query?: string, dir?: string, version?: string) => void;
  logInfo: (txt: string) => void;
  showNotification: (data: any) => void;
  createWingToWingWindow: (query: string) => void;
  openInChrome: (url: string) => void;
  fetchMetadata: (url: string) => Promise<any>;
  reloadApp: () => void;
  checkForOllama: () => Promise<boolean>;
  selectFileOrDirectory: () => Promise<string>;
  startPowerSaveBlocker: () => Promise<number>;
  stopPowerSaveBlocker: () => Promise<void>;
  getBinaryPath: (binaryName: string) => Promise<string>;
  on: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => void;
  off: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => void;
}

// Expose these types to the renderer process
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
