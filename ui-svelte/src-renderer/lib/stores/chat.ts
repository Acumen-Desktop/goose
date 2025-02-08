import GooseAPI from "../services/api";
import type { Message, ChatState } from "../../types/api";
import { writable } from "svelte/store";

let api: GooseAPI | null = null;

const createChatStore = () => {
  const { subscribe, set, update } = writable<ChatState>({
    messages: [],
    pendingMessage: "",
    isLoading: false,
    error: null,
  });

  return {
    subscribe,
    initialize: async (port: number) => {
      api = new GooseAPI(port);
      try {
        const history = await api.getChatHistory();
        update((state) => ({
          ...state,
          messages: history as Message[],
          error: null,
        }));
      } catch (error) {
        update((state) => ({
          ...state,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },
    sendMessage: async (content: string) => {
      if (!api) {
        throw new Error("API not initialized");
      }

      update((state) => ({
        ...state,
        isLoading: true,
        messages: [
          ...state.messages,
          {
            content,
            type: "user",
            timestamp: new Date(),
          } as Message,
        ],
      }));

      try {
        const response = await api.sendMessage(content);
        update((state) => ({
          ...state,
          isLoading: false,
          messages: [...state.messages, response as Message],
        }));
      } catch (error) {
        update((state) => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
    },
    reset: () => {
      set({
        messages: [],
        pendingMessage: "",
        isLoading: false,
        error: null,
      });
      api = null;
    },
  };
};

export const chatStore = createChatStore();
