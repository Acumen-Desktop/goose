// API interface for communicating with Goose instance
export interface BaseToolInvocation {
  toolCallId: string;
  toolName: string;
  state: "call" | "result";
}

export interface ToolArgs {
  query?: string;
  input?: string;
  [key: string]: unknown;
}

export interface ToolCall extends BaseToolInvocation {
  state: "call";
  args: ToolArgs;
}

export interface ToolResult extends BaseToolInvocation {
  state: "result";
  args: ToolArgs;
  result: {
    text: string;
    [key: string]: unknown;
  };
}

export type ToolInvocation = ToolCall | ToolResult;

export interface Message {
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  toolInvocations?: ToolInvocation[];
}

export interface ChatState {
  messages: Message[];
  pendingMessage: string;
  isLoading: boolean;
  error: Error | null;
}
