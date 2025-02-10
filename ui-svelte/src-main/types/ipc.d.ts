import type { IpcMainEvent } from "electron";

export interface WindowType {
  type: "launcher" | "chat";
  GOOSE_PORT?: number;
  GOOSE_WORKING_DIR?: string;
  GOOSE_API_HOST?: string;
  REQUEST_DIR?: string;
  secretKey?: string;
}

export interface IpcEvents {
  "create-chat-window": (
    event: IpcMainEvent,
    query?: string,
    dir?: string,
    version?: string
  ) => void;
  "directory-chooser": (event: IpcMainEvent, replace: boolean) => void;
  logInfo: (event: IpcMainEvent, info: string) => void;
  "reload-app": (event: IpcMainEvent) => void;
  toggleDevTools: (event: IpcMainEvent) => void;
  setTitleBarColors: (
    event: IpcMainEvent,
    bgColor: string,
    iconColor: string
  ) => void;
  "open-in-chrome": (event: IpcMainEvent, url: string) => void;
}
