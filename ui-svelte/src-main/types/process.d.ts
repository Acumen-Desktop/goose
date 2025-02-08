import type { ChildProcess, SpawnOptions } from "child_process";
import type { Readable, Writable } from "stream";

export interface GooseProcess extends ChildProcess {
  stdout: Readable;
  stderr: Readable;
  stdin: Writable;
}

export interface GooseSpawnOptions extends SpawnOptions {
  cwd?: string | URL;
  env?: NodeJS.ProcessEnv;
}

export interface StartGooseParams {
  app: Electron.App;
  dir?: string | null;
  port?: number;
}

export type GooseResult = [number, string, GooseProcess];
