import type { ChildProcessByStdio } from "node:child_process";

// ExtensionConfig type matching the Rust version
export type ExtensionConfig = {
  name: string;
  type: "stdio" | "sse" | "builtin";
  command?: string;
  args?: string[];
  cwd?: string;
  url?: string;
  env?: Record<string, string>;
  model?: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string[];
};

// Full extension configuration including runtime data
export type FullExtensionConfig = ExtensionConfig & {
  id: string;
  active: boolean;
  process?: ChildProcessByStdio<any, any, any>;
};

export interface ExtensionPayload {
  id: string;
  config: ExtensionConfig;
}
