import type { SvelteHTMLElements } from "svelte/elements";

// Re-export HTML element event types for convenience
export type HTMLInputEvents = {
  [K in keyof SvelteHTMLElements["input"]]: SvelteHTMLElements["input"][K];
};

export type HTMLButtonEvents = {
  [K in keyof SvelteHTMLElements["button"]]: SvelteHTMLElements["button"][K];
};

// Common component props
export interface ChatInputProps {
  messageText: string;
  onSend: (message: string) => void;
}

// Common component events
export interface ChatInputEvents {
  keydown: KeyboardEvent;
  click: MouseEvent;
}
