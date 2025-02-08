/// <reference types="svelte" />
/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

import type { ElectronAPI, AppConfigAPI } from "../src-main/types";
import type * as API from "./types/api";

declare global {
  // Electron API exposed to renderer
  interface Window {
    electron: ElectronAPI;
    appConfig: AppConfigAPI;
    // Window extensions
    toggleDevTools: () => void;
    setTitleBarColors: (
      backgroundColor: string,
      foregroundColor: string
    ) => void;
  }

  // Global type exports
  export type Message = API.Message;
  export type ToolInvocation = API.ToolInvocation;
  export type ChatState = API.ChatState;

  // SvelteKit types
  namespace App {
    interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
