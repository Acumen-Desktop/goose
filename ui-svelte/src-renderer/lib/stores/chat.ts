import { writable } from 'svelte/store';
import type GooseAPI from '../services/api';

export interface ChatState {
    messages: any[];
    isConnected: boolean;
    error: string | null;
}

function createChatStore() {
    const { subscribe, set, update } = writable<ChatState>({
        messages: [],
        isConnected: false,
        error: null
    });

    let api: GooseAPI | null = null;

    return {
        subscribe,
        initialize: async (port: number) => {
            api = new GooseAPI(port);
            try {
                const isConnected = await api.checkStatus();
                if (isConnected) {
                    const history = await api.getChatHistory();
                    update(state => ({ ...state, messages: history, isConnected: true, error: null }));
                } else {
                    update(state => ({ ...state, error: 'Could not connect to Goose instance' }));
                }
            } catch (error) {
                update(state => ({ ...state, error: 'Failed to initialize chat' }));
            }
        },
        sendMessage: async (content: string) => {
            if (!api) {
                throw new Error('API not initialized');
            }

            update(state => ({
                ...state,
                messages: [...state.messages, {
                    id: Date.now().toString(),
                    content,
                    type: 'user',
                    timestamp: new Date()
                }]
            }));

            try {
                const response = await api.sendMessage(content);
                update(state => ({
                    ...state,
                    messages: [...state.messages, response]
                }));
            } catch (error) {
                update(state => ({ ...state, error: 'Failed to send message' }));
            }
        },
        reset: () => {
            set({
                messages: [],
                isConnected: false,
                error: null
            });
            api = null;
        }
    };
}

export const chatStore = createChatStore();